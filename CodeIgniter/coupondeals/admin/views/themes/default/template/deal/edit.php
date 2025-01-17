<html lang="en">

<head>

<meta charset="utf-8" />

<title>Savetakatak| Deals</title>

<meta http-equiv="X-UA-Compatible" content="IE=edge">

<meta content="width=device-width, initial-scale=1" name="viewport" />

<meta content="" name="description" />

<meta content="" name="author" />

<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/plugins/select2/css/select2.min.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/plugins/select2/css/select2-bootstrap.min.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/plugins/bootstrap-summernote/summernote.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/css/components.min.css" rel="stylesheet" id="style_components" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/global/css/plugins.min.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/layouts/layout2/css/layout.min.css" rel="stylesheet" type="text/css" />

<link href="<?= site_url('views/themes/default') ?>/assets/layouts/layout2/css/themes/blue.min.css" rel="stylesheet" type="text/css" id="style_color" />

<link href="<?= site_url('views/themes/default') ?>/assets/layouts/layout2/css/custom.min.css" rel="stylesheet" type="text/css" />

<link rel="shortcut icon" href="favicon.ico" />

</head>



<body class="page-header-fixed page-sidebar-closed-hide-logo page-container-bg-solid">

<?php echo Modules::run('header/header/index'); ?>

<div class="page-container"> <?php echo Modules::run('menu/menu/index'); ?>

  <div class="page-content-wrapper">

    <div class="page-content">

      <div class="page-bar">

        <ul class="page-breadcrumb">

          <li> <i class="icon-home"></i> <a href="#">Home</a> <i class="fa fa-angle-right"></i> </li>

          <li> <span>Add Deals</span> </li>

        </ul>

      </div>

       <?php echo Modules::run('messages/message/index'); ?>

      <div class="row">

        <div class="col-md-12">

          <div class="portlet light portlet-fit portlet-form ">

            <div class="portlet-title">

              <div class="caption"> <i class="icon-settings font-dark"></i> <span class="caption-subject font-dark sbold uppercase">Add  deal</span> </div>

            </div>

            <div class="portlet-body">

              <?php 

            $attributes = array('class' => 'form-horizontal', 'id' => 'deals');

            echo form_open_multipart('deals/updatedeal', $attributes);  ?>

                <div class="form-body">

                 <input type="hidden" value="<?= $deals->deal_id ?>" name="deal_id">

                  <div class="form-group">

                    <label class="control-label col-md-3">Category <span class="required"> * </span> </label>

                    <div class="col-md-4">

                      <select class="form-control select2me" name="cat_id" id="cat_id">

                        

                    <?php foreach ($categories as $l): ?>

                   

                            <option value="<?= $l->cat_id ?>"  <?= $deals->cat_id == $l->cat_id ? 'selected': '' ?>><?= $l->cat_name ?></option>

                          

                    <?php endforeach ?>

                    

                      </select>

                    </div>

                  </div>

                  <div class="form-group">

                    <label class="control-label col-md-3">Brand <span class="required"> * </span> </label>

                    <div class="col-md-4">

                      <select class="form-control select2me" name="brand_id" id="brand_id">

                       

                       <?php foreach ($brands as $b): ?>

                 

                            <option value="<?= $b->brand_id ?>"  <?= $deals->brand_id == $b->brand_id ? 'selected': '' ?>><?= $b->brand_name ?></option>

                          

                    <?php endforeach ?>

                    

                      </select>

                    </div>

                  </div>

                  <div class="form-group">

                    <label class="control-label col-md-3">Title <span class="required"> * </span> </label>

                    <div class="col-md-4">

                      <input type="text" class="form-control" name="title" id="title" value="<?= $deals->title ?>" readonly>

                    </div>

                  </div>

                  <!--<div class="form-group">

                    <label class="control-label col-md-3">Short Description </label>

                    <div class="col-md-6">

                      <textarea name="short_desc" id="short_desc" cols="60" rows="5"><?= $deals->short_desc ?></textarea>

                    </div>

                  </div>-->

                  <?php  $uploadsee_path =  $this->config->item('show_upload_path').'/dealsimages/';?>

                  <div class="form-group ">

                    <label class="control-label col-md-3">Image </label>

                    <div class="col-md-9">

                      <div class="fileinput fileinput-new" data-provides="fileinput">

                     

                        <div class="fileinput-preview thumbnail" data-trigger="fileinput" style="width: 520px; height: 170px;"><img src="<?= $uploadsee_path.$deals->img_name;?>"> </div>

                        <div> <span class="btn red btn-outline btn-file"> <span class="fileinput-new"> Select image </span> <span class="fileinput-exists"> Change </span>

                          <input type="file" name="img_name" id="img_name">

                          </span> <a href="javascript:;" class="btn red fileinput-exists" data-dismiss="fileinput"> Remove </a> </div>

                      </div>

                    </div>

                  </div>
 <div class="form-group ">
 <label class="control-label col-md-3"> </label>

                  <div class="col-md-4">
   <div class="input-group input-medium margin-top-10 col-md-4">

        <input class="price" type="text" name="orignal_price" id="orignal_price" placeholder="Unit price" value="<?= $deals->orignal_price?>"/> <span class="input-group-addon"> <i class="fa fa-rupee"></i> </span>

    </div>

      

     <div class="input-group input-medium margin-top-10 col-md-4">

        <input class="total" type="text"  name="total_price" id="total_price" value="<?= $deals->total_price?>" placeholder="Total" />

        <span class="input-group-addon"> <i class="fa fa-rupee"></i> </span> 

    </div>

</div>
</div>

                  <!--<div class="form-group price">

                    <label class="control-label col-md-3"> </label>

    <div class="col-md-4">

   <div class="input-group input-medium margin-top-10 col-md-4">

        <input class="price" type="text" name="orignal_price" id="orignal_price" placeholder="Unit price" value="<?= $deals->orignal_price?>"/> <span class="input-group-addon"> <i class="fa fa-rupee"></i> </span>

    </div>

      <div class="input-group input-medium margin-top-10 col-md-4">

        <input class="rate" type="text" name="discount" id="discount" placeholder="Discount rate %" value="<?= $deals->discount?>"/>

        <span class="input-group-addon">% <i class="fa fa-percent"></i> </span>

    </div>

     <div class="input-group input-medium margin-top-10 col-md-4">

        <input class="total" type="text"  name="total_price" id="total_price" value="<?= $deals->total_price?>" placeholder="Total" />

        <span class="input-group-addon"> <i class="fa fa-rupee"></i> </span> 

    </div>

</div>

</div>-->

                  

                  <div class="form-group">

                    <label class="control-label col-md-3">Long Description</label>

                    <div class="col-md-6">

                      <textarea  name="long_desc" id="summernote_1"> <?= $deals->long_desc ?></textarea>

                    </div>

                  </div>

                  

                  <div class="form-group form-md-checkboxes">

                                             <label class="control-label col-md-3"></label>

                                            <div class="col-md-6">

                                                <div class="md-checkbox">

                                                   <label>Set As Hot Deal</label> <input id="checkbox6" class="md-check" type="checkbox" value="1"  name="hotdeal" <?= $deals->hotdeal == 1 ? 'checked': '' ?>>

                                                    <label for="checkbox6">

                                                        <span class="inc"></span>

                                                        <span class="check"></span>

                                                        <span class="box"></span></label>

                                                </div>

                                                

                                                </div>

                                           

                                        </div>

                                        

                                        <div class="form-group">

                    <label class="control-label col-md-3">Url <span class="required"> * </span> </label>

                    <div class="col-md-4">

                      <input type="text" class="form-control" name="deal_url" id="deal_url" value="<?= $deals->deal_url ?>">

                    </div>

                  </div>

                </div>

                <div class="form-actions">

                  <div class="row">

                    <div class="col-md-offset-3 col-md-9">

                      <button type="submit" class="btn green">Submit</button>

                      <button type="button" class="btn default">Cancel</button>

                    </div>

                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>

<?php echo Modules::run('footer/footer/index'); ?> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/jquery.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/js.cookie.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/select2/js/select2.full.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/jquery-validation/js/jquery.validate.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/jquery-validation/js/additional-methods.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/bootstrap-summernote/summernote.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/global/scripts/app.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/pages/scripts/form-validation.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/pages/scripts/components-editors.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/layouts/layout2/scripts/layout.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/layouts/layout2/scripts/demo.min.js" type="text/javascript"></script> 

<script src="<?= site_url('views/themes/default') ?>/assets/layouts/global/scripts/quick-sidebar.min.js" type="text/javascript"></script>

<!--<script>

function calculate( price, discount) {

    if (discount) {

        if (discount < 0 || discount > 100) {

            discount = 0;

        }

    } else {

        discount = 0;

    }

    return (price) * (1 - (discount / 100));

}



$('input').on('change', function () {

    var scope = $(this).closest('.price'),

        

        price = $('.price', scope).val(),

        discount = $('.rate', scope).val(),

        total = $('.total', scope);

    if ( $.isNumeric(price) && ($.isNumeric(discount) || discount === '')) {

        total.val(calculate( price, discount));

    } else {

        total.val('');

    }

});

</script>
-->
</body>

</html>