<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title><?php echo $title; ?></title>
<style type="text/css">
body {
	color: #000000;
	font-family: Arial, Helvetica, sans-serif;
}
body, td, th, input, textarea, select, a {
	font-size: 12px;
}
p {
	margin-top: 0px;
	margin-bottom: 20px;
}
a, a:visited, a b {
	color: #378DC1;
	text-decoration: underline;
	cursor: pointer;
}
a:hover {
	text-decoration: none;
}
a img {
	border: none;
}
#container {
	width: 680px;
}
</style>
</head>
<body>
<div id="container">
  
  <div style="float: right; margin-left: 20px;">
    <a href="" title="<?php echo $company_name; ?>">
      <?php echo $company_name; ?>
   </a>
  </div>
  
  <div>
    Your order no #<?= $customer_info->o_id; ?><br>

    is now <?= $order_status ?>
  </div>
</div>
</body>
</html>
