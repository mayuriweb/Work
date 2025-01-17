<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title><?= 'Admin' ?> | <?= ucfirst($site_name) ?> </title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="description" content="">
    <meta name="author" content="">
    <link type="text/css" href="<?= site_url('views/themes/default') ?>/assets/fonts/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    
    <link type="text/css" href="<?= site_url('views/themes/default') ?>/assets/fonts/themify-icons/themify-icons.css" rel="stylesheet">
    <!-- Themify Icons -->
    <link type="text/css" href="<?= site_url('views/themes/default') ?>/assets/css/styles.css" rel="stylesheet">
    <!-- The following CSS are included as plugins and can be removed if unused-->
    <link rel="stylesheet" href="<?= site_url('views/themes/default') ?>/assets/plugins/alertifyjs/css/alertify.css">
    <link rel="stylesheet" href="<?= site_url('views/themes/default') ?>/assets/plugins/alertifyjs/css/themes/bootstrap.css">
     <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/themes/base/minified/jquery-ui.min.css" type="text/css" /> 
</head>
<body class="animated-content">
    
<header id="topnav" class="navbar navbar-midnightblue navbar-static-top" role="banner">

    <div class="logo-area">
        <span id="trigger-sidebar" class="toolbar-trigger toolbar-icon-bg">
            <a data-toggle="tooltips" data-placement="right" title="Toggle Sidebar">
                <span class="icon-bg">
                    <i class="ti ti-menu"></i>
                </span>
            </a>
        </span>

        <a class="navbar-brand" href="<?php echo base_url(); ?>"><?php echo $this->lang->line('Admin') ?></a>
    </div>
    <!-- logo-area -->

    <ul class="nav navbar-nav toolbar pull-right">
       
        <li class="toolbar-icon-bg hidden-xs" id="trigger-fullscreen">
            <a href="#" class="toggle-fullscreen"><span class="icon-bg"><i class="ti ti-fullscreen"></i></span></i></a>
        </li>
       
         <li class="dropdown toolbar-icon-bg">
            <a href="#" class="dropdown-toggle username" data-toggle="dropdown">
                <span class="icon-bg"><i class="ti ti-user"></i></span></i>
            </a>

            <ul class="dropdown-menu userinfo arrow">
                <?php if($this->session->userdata('is_admin')){ ?>
                <li><a href="<?php echo site_url('users/editprofile') ?>"><i class="ti ti-user"></i><span>Profile</span></a></li>
                <li><a href="<?php echo site_url('settings'); ?>"><i class="ti ti-settings"></i><span>Settings</span></a></li>
                <?php } ?>
                <li><a href="<?php echo site_url('login/logout'); ?>"><i class="ti ti-shift-right"></i><span>Sign Out</span></a></li>
            </ul>

        </li>
       
    </ul>

</header>