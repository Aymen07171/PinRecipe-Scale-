<?php
/**
 * Plugin Name: PinRecipe Scale Unified REST Bridge
 * Description: High-speed secure rest endpoint handler to fetch categories, insert categories, bypass CORS, sideline images (Featured, Middle, Bottom), write formatted articles and upload custom Tasty Recipe card structures.
 * Version: 3.5.4
 * Author: PinRecipe Scale Engine
 * License: GPLv2 or later
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// BROWSER REST CORS HANDLERS
add_action( 'init', 'pinrecipe_scale_handle_preflights', 1 );
function pinrecipe_scale_handle_preflights() {
    if ( isset( $_SERVER['REQUEST_URI'] ) && strpos( $_SERVER['REQUEST_URI'], 'pinrecipe-bridge/v1' ) !== false ) {
        if ( isset( $_SERVER['HTTP_ORIGIN'] ) ) {
            header( "Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN'] );
            header( "Access-Control-Allow-Credentials: true" );
            header( "Access-Control-Max-Age: 86400" );
        }
        if ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS' ) {
            header( "Access-Control-Allow-Methods: GET, POST, OPTIONS" );
            header( "Access-Control-Allow-Headers: Authorization, X-Scale-Bridge-Token, Content-Type" );
            status_header( 200 );
            exit( 0 );
        }
    }
}

add_filter( 'rest_allowed_cors_headers', function( $headers ) {
    if ( ! in_array( 'X-Scale-Bridge-Token', $headers ) ) {
        $headers[] = 'X-Scale-Bridge-Token';
    }
    return $headers;
});

// Create secure token meta upon activation
register_activation_hook( __FILE__, 'pinrecipe_scale_bridge_activate' );
function pinrecipe_scale_bridge_activate() {
    if ( ! get_option( 'pinrecipe_scale_secure_token' ) ) {
        $secure_token = 'scl_' . bin2hex( random_bytes( 16 ) );
        update_option( 'pinrecipe_scale_secure_token', $secure_token );
    }
}

// REST ENDPOINT INITS
add_action( 'rest_api_init', 'pinrecipe_scale_register_routes' );
function pinrecipe_scale_register_routes() {
    register_rest_route( 'pinrecipe-bridge/v1', '/test', array(
        'methods'             => 'GET,OPTIONS',
        'callback'            => 'pinrecipe_scale_test_route_handler',
        'permission_callback' => 'pinrecipe_scale_auth_check',
    ));
    register_rest_route( 'pinrecipe-bridge/v1', '/categories', array(
        'methods'             => 'GET,OPTIONS',
        'callback'            => 'pinrecipe_scale_categories_route_handler',
        'permission_callback' => 'pinrecipe_scale_auth_check',
    ));
    register_rest_route( 'pinrecipe-bridge/v1', '/publish', array(
        'methods'             => 'POST,OPTIONS',
        'callback'            => 'pinrecipe_scale_publish_route_handler',
        'permission_callback' => 'pinrecipe_scale_auth_check',
    ));
}

function pinrecipe_scale_auth_check( $request ) {
    if ( $request->get_method() === 'OPTIONS' ) {
        return true;
    }
    $token = $request->get_header( 'X-Scale-Bridge-Token' );
    $stored_token = get_option( 'pinrecipe_scale_secure_token' );
    return ( $token && $stored_token && hash_equals( $stored_token, $token ) );
}

function pinrecipe_scale_test_route_handler( $request ) {
    return new WP_REST_Response( array( 
        'success' => true, 
        'blog_name' => get_bloginfo( 'name' ) 
    ), 200 );
}

function pinrecipe_scale_categories_route_handler( $request ) {
    $categories = get_categories( array( 'hide_empty' => 0 ) );
    $formatted = array();
    foreach ( $categories as $cat ) {
        $formatted[] = array( 'id' => $cat->term_id, 'name' => $cat->name );
    }
    return new WP_REST_Response( $formatted, 200 );
}

// Upload base64 dynamically to WP Media Library and attach to specified post (Now optimized for WebP)
function pinrecipe_scale_upload_base64_media( $base64_data, $title, $alt_text, $post_id ) {
    require_once( ABSPATH . 'wp-admin/includes/image.php' );
    require_once( ABSPATH . 'wp-admin/includes/file.php' );
    require_once( ABSPATH . 'wp-admin/includes/media.php' );

    $base64_clean = preg_replace( '#^data:image/\w+;base64,#i', '', $base64_data );
    $raw_binary = base64_decode( $base64_clean );
    if ( $raw_binary === false ) {
        return new WP_Error( 'decode_failed', 'Failed to parse Base64 file' );
    }

    // Now publishing natively using .webp extension
    $filename = sanitize_file_name( strtolower( str_replace( ' ', '-', $title ) ) . '-' . wp_generate_password( 5, false ) . '.webp' );
    $upload_file = wp_upload_bits( $filename, null, $raw_binary );

    if ( isset( $upload_file['error'] ) && $upload_file['error'] !== false ) {
        return new WP_Error( 'upload_failed', $upload_file['error'] );
    }

    $wp_filetype = wp_check_filetype( $upload_file['file'], null );
    $attachment = array(
        'post_mime_type' => $wp_filetype['type'],
        'post_title'     => sanitize_text_field( $title ),
        'post_content'   => '',
        'post_status'    => 'inherit'
    );

    $attach_id = wp_insert_attachment( $attachment, $upload_file['file'], $post_id );
    if ( is_wp_error( $attach_id ) ) {
        return $attach_id;
    }

    $attach_data = wp_generate_attachment_metadata( $attach_id, $upload_file['file'] );
    wp_update_attachment_metadata( $attach_id, $attach_data );
    
    if ( ! empty( $alt_text ) ) {
        update_post_meta( $attach_id, '_wp_attachment_image_alt', sanitize_text_field( $alt_text ) );
    }

    return array( 'id' => $attach_id, 'url' => $upload_file['url'] );
}

// Master execution pipeline handler for unified deployment
function pinrecipe_scale_publish_route_handler( $request ) {
    $params = $request->get_json_params();
    if ( empty( $params['title'] ) || empty( $params['content'] ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => 'Missing title/content configurations.' ), 400 );
    }

    $title = sanitize_text_field( $params['title'] );
    $content = $params['content']; // Preserve raw inner-HTML tags
    $category_id = intval( $params['category_id'] ?? 1 );
    $save_status = sanitize_text_field( $params['save_status'] ?? 'publish' );

    // 1. Publish raw post initially
    $post_id = wp_insert_post( array(
        'post_title'    => $title,
        'post_content'  => $content,
        'post_status'   => $save_status,
        'post_type'     => 'post',
        'post_category' => array( $category_id )
    ));

    if ( is_wp_error( $post_id ) ) {
        return new WP_REST_Response( array( 'success' => false, 'message' => $post_id->get_error_message() ), 500 );
    }

    $warnings = array();
    $image1_url = "";
    $image2_url = "";
    $image3_url = "";

    // 2. Upload Zoom 1 as WP Post Featured Image / Thumbnail (Optimized as WebP)
    if ( ! empty( $params['zoom1_base64'] ) ) {
        $img1 = pinrecipe_scale_upload_base64_media( $params['zoom1_base64'], $title . ' - Zoom 1', $title, $post_id );
        if ( is_wp_error( $img1 ) ) {
            $warnings[] = "Zoom 1 Featured image error: " . $img1->get_error_message();
        } else {
            $image1_url = $img1['url'];
            set_post_thumbnail( $post_id, $img1['id'] );
        }
    }

    // 3. Upload Zoom 2 and place inside the content midsection paragraph (Optimized as WebP)
    if ( ! empty( $params['zoom2_base64'] ) ) {
        $img2 = pinrecipe_scale_upload_base64_media( $params['zoom2_base64'], $title . ' - Zoom 2', $title, $post_id );
        if ( is_wp_error( $img2 ) ) {
            $warnings[] = "Zoom 2 Middle image error: " . $img2->get_error_message();
        } else {
            $image2_url = $img2['url'];
            $img2_html = "\n\n<!-- wp:image {\"id\":" . $img2['id'] . ",\"sizeSlug\":\"large\"} -->\n<figure class=\"wp-block-image size-large\"><img src=\"" . esc_url( $image2_url ) . "\" alt=\"" . esc_attr( $title ) . "\" class=\"wp-image-" . $img2['id'] . "\"/></figure>\n<!-- /wp:image -->\n\n";
            
            // Insert after middle paragraph
            $paragraphs = explode( '</p>', $content );
            $p_count = count( $paragraphs );
            if ( $p_count > 1 ) {
                $mid = floor( $p_count / 2 );
                $paragraphs[$mid] .= $img2_html;
                $content = implode( '</p>', $paragraphs );
            } else {
                $content .= $img2_html;
            }
        }
    }

    // 4. Upload Pinterest Pin and place at the bottom of the article (Optimized as WebP)
    if ( ! empty( $params['pin_base64'] ) ) {
        $img3 = pinrecipe_scale_upload_base64_media( $params['pin_base64'], $title . ' - Pinterest Pin', $title, $post_id );
        if ( is_wp_error( $img3 ) ) {
            $warnings[] = "Pin Template Image error: " . $img3->get_error_message();
        } else {
            $image3_url = $img3['url'];
            $img3_html = "\n\n<!-- wp:image {\"id\":" . $img3['id'] . ",\"sizeSlug\":\"large\"} -->\n<figure class=\"wp-block-image size-large\"><img src=\"" . esc_url( $image3_url ) . "\" alt=\"" . esc_attr( $title ) . "\" class=\"wp-image-" . $img3['id'] . "\"/></figure>\n<!-- /wp:image -->\n\n";
            $content .= $img3_html;
        }
    }

    // Update post content changes containing images
    wp_update_post( array(
        'ID'           => $post_id,
        'post_content' => $content
    ));

    // 5. If Recipe card parameters exist, compile Tasty recipe card custom post and attach to post
    $recipe_id = 0;
    if ( ! empty( $params['recipe'] ) && class_exists( 'Tasty_Recipes' ) ) {
        $recipe_data = $params['recipe'];
        $recipe_post_id = wp_insert_post( array(
            'post_title'  => $recipe_data['title'],
            'post_status' => 'publish',
            'post_type'   => 'tasty_recipe'
        ));

        if ( ! is_wp_error( $recipe_post_id ) ) {
            $recipe_id = $recipe_post_id;
            update_post_meta( $recipe_post_id, 'recipe_title', $recipe_data['title'] );
            update_post_meta( $recipe_post_id, 'recipe_yield', $recipe_data['yield'] );
            update_post_meta( $recipe_post_id, 'diet', $recipe_data['diet'] );
            update_post_meta( $recipe_post_id, 'ingredients', $recipe_data['ingredients_raw'] );
            update_post_meta( $recipe_post_id, 'instructions', $recipe_data['instructions_raw'] );
            update_post_meta( $recipe_post_id, 'cook_time', $recipe_data['total_time'] );
            update_post_meta( $recipe_post_id, 'prep_time', '' );

            if ( ! empty( $img1 ) && ! is_wp_error( $img1 ) ) {
                set_post_thumbnail( $recipe_post_id, $img1['id'] );
                update_post_meta( $recipe_post_id, 'recipe_thumbnail_id', $img1['id'] );
            }

            // Inject the Tasty Recipe shortcode at the bottom of the original post
            $post = get_post( $post_id );
            $shortcode = "\n\n[tasty-recipe id=\"" . $recipe_post_id . "\"]\n";
            wp_update_post( array(
                'ID'           => $post_id,
                'post_content' => $post->post_content . $shortcode
            ));
        }
    }

    return new WP_REST_Response( array(
        'success'      => true,
        'post_id'      => $post_id,
        'url'          => get_permalink( $post_id ),
        'pin_url'      => $image3_url,
        'recipe_id'    => $recipe_id,
        'warnings'     => $warnings
    ), 200 );
}

// Settings dashboard inside WP Admin Menu - Configured as Prominent Sidebar Menu Item
add_action( 'admin_menu', 'pinrecipe_scale_admin_menu' );
function pinrecipe_scale_admin_menu() {
    add_menu_page(
        'PinRecipe Scale Setup',
        'PinRecipe Scale',
        'manage_options',
        'pinrecipe-scale-bridge',
        'pinrecipe_scale_bridge_menu_page',
        'dashicons-key', // Standard secure key icon
        81 // Placed clearly in Sidebar
    );
}

function pinrecipe_scale_bridge_menu_page() {
    if ( isset( $_POST['regenerate_token'] ) ) {
        $secure_token = 'scl_' . bin2hex( random_bytes( 16 ) );
        update_option( 'pinrecipe_scale_secure_token', $secure_token );
        echo '<div class="notice notice-success"><p>New API access token regenerated successfully.</p></div>';
    }
    $token = get_option( 'pinrecipe_scale_secure_token' );
    ?>
    <div class="wrap" style="max-width: 800px; margin-top:30px;">
        <div style="background:#fff; padding:30px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.05); border:1px solid #cbd5e1; border:1px solid #cbd5e1;">
            <h1 style="font-weight:800; font-size:24px; color:#0f172a; margin-bottom:5px;">PinRecipe Scale REST Bridge</h1>
            <p style="color:#64748b; font-size:13px; margin-top:0;">Secure authorization bridge for high-speed automated scaling campaigns.</p>
            <hr style="border:none; border-top:1px solid #e2e8f0; margin:20px 0;" />
            
            <table class="form-table">
                <tr>
                    <th scope="row" style="font-weight:600; width:220px;">Connection Token</th>
                    <td>
                        <input type="text" value="<?php echo esc_attr( $token ); ?>" style="font-family:monospace; background:#f1f5f9; padding:8px 12px; font-size:13px; border-radius:6px; border:1px solid #cbd5e1; width:100%;" readonly onclick="this.select();" />
                        <p class="description">Copy and paste this Token value into your Canvas Scale Engine Tool settings.</p>
                    </td>
                </tr>
            </table>

            <form method="post" style="margin-top:25px;">
                <input type="submit" name="regenerate_token" class="button button-primary" style="background:#4f46e5; border-color:#4338ca; font-weight:600; padding:6px 15px; height:auto; border-radius:6px;" value="Regenerate Security Token" />
            </form>
        </div>
    </div>
    <?php
}

// Ensure every single recipe post renders the full readable magazine article layout regardless of theme bugs
add_filter( 'template_include', 'pinrecipe_scale_override_single_template', 999 );
function pinrecipe_scale_override_single_template( $template ) {
    if ( is_singular( 'post' ) ) {
        $custom_tpl = dirname( __FILE__ ) . '/single-recipe-template.php';
        if ( file_exists( $custom_tpl ) ) {
            return $custom_tpl;
        }
    }
    return $template;
}

