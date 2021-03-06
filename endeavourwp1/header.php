<?php 
	$tempdiruri = get_template_directory_uri();
  $siteurl = site_url();
  $logedin = is_user_logged_in(); 
  // $blogname = bloginfo('name');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="Endeavour Explorer Scout Unit">
  <meta name="author" content="Ausculta Ltd">
  <!-- <link rel="icon" type="image/png" sizes="32x32" href="<?php echo $tempdiruri . '/images/favicon-32x32.png' ?>"> -->
  <!-- <link rel="icon" type="image/png" sizes="96x96" href="<?php echo $tempdiruri . '/images/favicon-96x96.png' ?>"> -->
  <!-- <link rel="icon" type="image/png" sizes="16x16" href="<?php echo $tempdiruri . '/images/favicon-16x16.png' ?>"> -->
  <link rel="icon" href="<?php echo $tempdiruri . '/images/favicon.ico' ?>">
  <link href='https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,900' rel='stylesheet'>
  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <div class="container-fluid">
    <div class='row m-0 p-0 align-items-left'> <!-- Logo bar -->
      <div class='col-2 align-self-start m-0 p-0'>
        <a href="<?php echo $siteurl; ?>"><img  class="d-block m-0 p-0" src="/assets/logo.png" alt="Scouts - Be Prepared" /></a>
      </div> <!-- /col -->
      <div class='col-10 align-self-center m-0 p-0'>     
        <div id="main_navbar" class="navbar navbar-expand-md navbar-light m-0 p-0">
          <button class="navbar-toggler btn-sm" type="button" style="font-size:0.75rem; color:#707070" data-toggle="collapse" data-target="#menuheader-navbar" aria-controls="menuheader-navbar" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <nav class="collapse navbar-collapse bg-transparent justify-content-end" id="menuheader-navbar" role="navigation" aria-label="Main Menu">
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
              if ($logedin) {
                if (!current_user_can('administrator') && !is_admin()) {
                  $menu_args['menu'] = 'menuheader_users';
                } else {
                  $menu_args['menu'] = 'menuheader_admins';
                }
              } 
              wp_nav_menu( $menu_args );
            ?>
			    </nav>
        </div> <!-- /navbar -->
        <h3 class="text-center m-0 p-0">Endeavour Explorer Scout Unit</h3>
        <p class="text-right m-0 p-0">By Land... By Sea... By Air...</p>
        <div id="main_navbar" class="navbar navbar-expand-md navbar-light m-0 p-0" >
          <button class="navbar-toggler" type="button" style="font-size:0.75rem;" data-toggle="collapse" data-target="#menumain-navbar" aria-controls="menumain-navbar" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <nav class="collapse navbar-collapse bg-transparent justify-content-start" id="menumain-navbar" role="navigation" aria-label="Main Menu">
            <?php
              $menu_args = array(
                'theme_location'    => 'menumain',
                'depth'             => 3, // 1 = no dropdowns, 2 = with dropdowns
                'container'         => false,
                // 'container'         => 'div',
                // 'container_class'   => 'collapse navbar-collapse bg-transparent',
                // 'container_id'      => 'bs_menumain-navbar',
                'menu_class'        => 'navbar-nav m-0 p-0',
                'fallback_cb'       => 'WP_Bootstrap_Navwalker::fallback',
                'walker'            => new WP_Bootstrap_Navwalker(),
              );
              if ($logedin) { 
                $menu_args['menu'] = 'menu_users';
              } else {
                $menu_args['menu'] = 'menu_visitors';
              }
              wp_nav_menu( $menu_args );
            ?>
          </nav>
        </div> <!-- /navbar -->
      </div> <!-- /col -->
    </div> <!-- /row -->