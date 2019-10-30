<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="Ausculta Ltd">
  <link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory_uri() . '/images/favicon-32x32.png' ?>">
  <link rel="icon" type="image/png" sizes="96x96" href="<?php echo get_template_directory_uri() . '/images/favicon-96x96.png' ?>">
  <link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory_uri() . '/images/favicon-16x16.png' ?>">
  <link rel="icon" href="<?php echo get_template_directory_uri() . '/images/favicon.ico' ?>">
  <link href='https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,900' rel='stylesheet'>
  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <div class="container">
    <div id="main_navbar" class="navbar navbar-expand-md navbar-light mr-auto">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#menumain-navbar" aria-controls="menumain-navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <nav class="collapse navbar-collapse bg-transparent justify-content-end" id="menumain-navbar" role="navigation" aria-label="Main Menu">
        <!-- Brand and toggle get grouped for better mobile display -->
        <!-- <a class="navbar-brand" href="#"><img src="/assets/media/old-fleur-de-lys.png" width="30" height="30" alt="">&nbsp;<?php bloginfo('name'); ?></a> -->
        <?php
          $menu_args = array(
            'theme_location'    => 'menuheader',
            'depth'             => 2, // 1 = no dropdowns, 2 = with dropdowns
            'container'         => false,
            'menu_class'        => 'nav navbar-nav',
            'fallback_cb'       => 'WP_Bootstrap_Navwalker::fallback',
            'walker'            => new WP_Bootstrap_Navwalker(),
            'menu'              => 'menuheader_visitors',
          );
          if (is_user_logged_in()) { 
            $menu_args['menu'] = 'menuheader_users';
          } 
          wp_nav_menu( $menu_args );
        ?>
      </nav>
    </div> <!-- /navbar -->
    <div class='row'> <!-- Logo bar -->
      <div class='col-3 align-self-start'>
        <p><a class="brand" href="<?php echo site_url(); ?>"><img style="padding: 5; float:center; text-align: none;" src="/assets/media/fleurdelys-87x80.png" alt="<?php bloginfo('name'); ?>"/></a></p>
      </div> <!-- /col -->
      <div class='col-6 align-self-center'>
        <h2 style="text-align: center;" border=0>Endeavour Explorer Scout Unit</h2>
        <p class="text-right">By Land... By Sea... By Air...</p>
      </div> <!-- /col -->
      <div class='col-3 align-items-end'>
        <a href="https://www.scouts.org.uk/" border=0><img style="padding: 5; float:none; text-align: center;" src="/assets/media/endeavourlinear-175x80.png" alt="Scouts - Be Prepared" /></a>
      </div> <!-- /col -->
    </div> <!-- row -->
    <div id="main_navbar" class="navbar navbar-expand-md navbar-light mr-auto">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#menumain-navbar" aria-controls="menumain-navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <nav class="collapse navbar-collapse bg-transparent" id="menumain-navbar" role="navigation" aria-label="Main Menu">
        <!-- Brand and toggle get grouped for better mobile display -->
        <a class="navbar-brand" href="<?php echo site_url(); ?>"><img src="<?php echo get_template_directory_uri() . '/images/favicon-16x16.png'; ?>" alt="Fleur de Lys">&nbsp;<?php bloginfo('name'); ?></a>
        <?php
          $menu_args = array(
            'theme_location'    => 'menumain',
            'depth'             => 2, // 1 = no dropdowns, 2 = with dropdowns
            'container'         => false,
            'menu_class'        => 'nav navbar-nav',
            'fallback_cb'       => 'WP_Bootstrap_Navwalker::fallback',
            'walker'            => new WP_Bootstrap_Navwalker(),
            'menu'              => 'menu_visitors',
          );
          if (is_user_logged_in()) { 
            $menu_args['menu'] = 'menu_users';
          } 
          wp_nav_menu( $menu_args );
        ?>
      </nav>
    </div> <!-- /navbar -->
    <div class='row'> <!-- quote area -->
      <div class='col-12 align-self-center' id="quotearea">
      </div> <!-- /col -->
    </div> <!-- /row quote area -->
 