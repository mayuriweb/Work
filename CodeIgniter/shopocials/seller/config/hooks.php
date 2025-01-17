<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| Hooks
| -------------------------------------------------------------------------
| This file lets you define "hooks" to extend CI without hacking the core
| files.  Please see the user guide for info:
|
|	http://codeigniter.com/user_guide/general/hooks.html
|
*/
$hook['post_controller_constructor'] = array(
    'class'     => 'Authenticate',
    'function'  => 'index',
    'filename'  => 'Authenticate.php',
    'filepath'  => 'hooks'
);
$hook['pre_controller'] = array(
    'class'     => 'Authenticate',
    'function'  => 'force_ssl',
    'filename'  => 'Authenticate.php',
    'filepath'  => 'hooks'
);