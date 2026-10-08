<?php
/**
 * Single Recipe & Article Template
 * Ensures posts always render full, readable, clean-white magazine articles with a top download button.
 */

get_header();
?>

<div class="pinrecipe-single-wrapper" style="background: #f8fafc; padding: 40px 16px; min-height: 80vh;">
    <main id="main" class="site-main" style="max-width: 900px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 48px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
        <?php
        while ( have_posts() ) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                
                <!-- Category Badges & Meta Header -->
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
                    <?php
                    $categories = get_the_category();
                    if ( ! empty( $categories ) ) {
                        foreach ( $categories as $cat ) {
                            echo '<span style="background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase;">' . esc_html( $cat->name ) . '</span> ';
                        }
                    }
                    ?>
                    <span style="color: #64748b; font-size: 13px; margin-left: auto;">
                        ⏱️ <?php echo get_the_date(); ?> · Chef Masterclass
                    </span>
                </div>

                <h1 class="entry-title" style="font-family: Georgia, 'Playfair Display', serif; font-size: 36px; font-weight: 800; line-height: 1.25; color: #0f172a; margin: 0 0 20px 0;">
                    <?php the_title(); ?>
                </h1>

                <!-- TOP DOWNLOAD & PRINT ACTION BAR -->
                <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between; background: #fdf2f8; border: 1px solid #fbcfe8; padding: 14px 20px; border-radius: 12px; margin-bottom: 28px; flex-wrap: wrap;">
                    <span style="font-weight: 700; color: #be185d; font-size: 13px;">
                        ⭐ Authentic Recipe Guide & Printable Card
                    </span>
                    <button onclick="window.print()" style="display: inline-flex; align-items: center; gap: 6px; background: #be185d; color: #ffffff; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 13px; border: none; cursor: pointer; box-shadow: 0 2px 6px rgba(190, 24, 93, 0.25);">
                        📥 Download / Print Recipe PDF
                    </button>
                </div>

                <!-- FULL POST CONTENT -->
                <div class="entry-content" style="font-size: 17px; line-height: 1.8; color: #334155;">
                    <?php
                    the_content();
                    ?>
                </div>

            </article>
            <?php
        endwhile;
        ?>
    </main>
</div>

<?php
get_footer();
