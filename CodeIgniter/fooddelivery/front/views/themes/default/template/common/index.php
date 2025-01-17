<?php echo Modules::run('header/header/index'); ?>
<?php $type = $this->session->userdata('type'); ?>

	<div class="page-wrapper" >

		<div class="main group-f">
			<div class="tab">
				<div id="grocery" style="background-image: url('<?= site_url('front/views/themes/default'); ?>/images/HP_2_groceries_1920x800.jpg')" class="bg-image  <?= $type=='grocery' ? 'in':'' ?>  tab-content" ></div>
				<div id="liquor" style="background-image: url('<?= site_url('front/views/themes/default'); ?>/images/HP_1_alcohol_1920x800.jpg')" class="bg-image  <?= $type=='liquor' ? 'in':'' ?>  tab-content" ></div>
				<div id="cleaner" style="background-image: url('<?= site_url('front/views/themes/default'); ?>/images/HP_2_laundry_1920x800.jpg')" class="bg-image  <?= $type=='cleaner' ? 'in':'' ?>  tab-content" ></div>
				<div id="food"	style="background-image: url('<?= site_url('front/views/themes/default'); ?>/images/HP_3_food_1920x800.jpg')" class="bg-image   <?= $type=='food' ? 'in':'' ?>  tab-content" ></div>	
			</div>
			<div class="inner-wrapper">
				<div class="search-field" dcom-viewport-spy="mainSearchForm" id="mainSearchForm">
					<!-- header-->
					<div id="text-wrapper">
						<span class="split-text">See who delivers</span>
						<span class="split-text"> in your neighborhood.</span>
					</div>

					<div class="tabs-wrapper">
						<ul class="home-tabs">
							<li class="tab food-tab  <?= $type=='food' ? 'active':'' ?> " >
								<a class="" title="food" href="#food" ><span class="icon-food"></span> Food</a>
							</li>
							<li class="tab alcohol-tab   <?= $type=='liquor' ? 'active':'' ?>" >
								<a class="" title="liquor"  href="#liquor" ><span class="icon-alcohol"></span> Alcohol</a>
							</li>
							<li class="tab groceries-tab  <?= $type=='grocery' ? 'active':'' ?>" >
								<a class="" title="grocery" href="#grocery" ><span class="icon-groceries"></span> Groceries</a>
							</li>
							<li class="tab laundry-tab  <?= $type=='cleaner' ? 'active':'' ?>" >
								<a class="" title="cleaner" href="#cleaner" ><span class="icon-laundry"></span> Laundry</a>
							</li>
						</ul>
					</div>
					
					<div class="search-form dark " >
						<div class="address-search">
							<form class="ng-pristine ng-valid" name="main-searchform" action="<?= site_url('search'); ?>" method="GET">
								<div class="delivery-pickup">

										<span class="delivery-select <?= $pickordelivery =='delivery' ? 'active' : 'inactive' ?>">Delivery
										</span> 
										<input type="checkbox"  name="pickordelivery" class="optionpicordel"  <?= $pickordelivery =='pickup' ? 'checked' : '' ?>  > 
										<span class="pickup-select <?= $pickordelivery =='pickup' ? 'active' : 'inactive' ?>">Pickup</span>

								</div>

								<span class="laundry-toggle-message ng-hide" >Schedule pickup and delivery</span>
								<div class="dropdown-arrow-wrapper" ></div>
								<div  class="location-based-search-wrapper ng-pristine ng-untouched ng-valid left-toggle" >
									<div class="location-button-wrapper" >
										<span class="icon-location-arrow" onclick= "geolocate()" ></span>
										<span class="spinner ng-hide"></span>                                        
									</div>
								</div>
								<div class="search-autocomplete" id="locationField">
									<input  id="address-search" required placeholder="Street Address, City, State" autocomplete="off" tabindex="1"  type="search">
								</div>
								<div  class="main-item-search-container " >
									<input  class="main-item-search " placeholder="Food" tabindex="2" name="keyword" type="text">
									<span class="icon-search"> </span>
								</div>
									<input class="field" name="street_number" type="hidden" id="street_number"disabled="true">
									<input class="field" type="hidden" id="route" disabled="true">
									<input class="field" name="city" type="hidden" id="locality" disabled="true">
									<input class="field" name="state" type="hidden" id="administrative_area_level_1" disabled="true">
									<input class="field" name="zip" type="hidden" id="postal_code" disabled="true">
									<input class="field"  type="hidden" id="country" disabled="true">
									<input class="field" name="type" type="hidden" id="type" value="<?= $type; ?>">
									
								<button type="submit" class="address-search-submit button primary" tabindex="3">Search</button>
							</form>
						</div>
					</div>
					<div class="message ng-hide"></div>
				</div>
			</div>
		</div>
		<div id="main-content-wrapper-home">
			<div id="main-content">
				<div class="current-points">
					<h3 class="delivery-points">
						<a href = "<?php echo site_url('delivery_points') ?>" class="" tooltip="Every $1 you spend on delivery.com earns 25 points. Rack 'em up and cash 'em in for great rewards." tooltip-placement="bottom">
							<span class="icon-trophy"></span> Order and earn Delivery Points <span class="icon-full-arrow-right"></span>
						</a>
					</h3>
				</div>

				<div class="mktg-callouts" >
					<div class="callout">
						<span class="icon-mobile"></span>
						<h3>Easy ordering</h3>
						<p>It's quick, convenient, and free to use on any device.</p>
					</div>
					<div class="callout">
						<!-- <span class="icon-dlocation"></span> -->
						<span class="iconme-location2"></span>
						<h3>More choices</h3>
						<p>Everything you want, including wine and liquor, in one place.</p>
					</div>
					<div class="callout">
						<span class="icon-trophy"></span>
						<h3>Earn rewards</h3>
						<p>Score Delivery Points with every purchase and get great rewards.</p>
					</div>
				</div>
				<div id="browse-by-container">
					<div >
						<?php if (isset($cuisine)): ?>
							<div class="cuisine-container" >
								<h3>Browse by Cuisine</h3>
								<?php $upload_path =  base_url().'upload/cuisine/'; ?>
								<?php $i =0; foreach($cuisine as $c): 
								 ?>
								<?php if ($c->featured_on): ?>
								<a href="<?= site_url('food/'.url_title(strtolower($c->cusine_type)).''); ?>">
									<div class="overlay"></div><h4><?= $c->cusine_type;?>
									</h4>
									<img src="<?= $upload_path.$c->cuisine_image_url ?>" class="b-lazy " alt="Order <?= $c->cusine_type;?> for delivery or takeout" >
								</a>
								<?php endif; ?>
								<?php  $i++; endforeach; ?>
								<div class="clearfix"></div>
								<table id="cuisines-list">
									<tbody>
										
										<tr>
											<?php $b =1;  foreach ($cuisinelist as $ct): ?>
											<?php echo $b =='1' ? '<td>' :'' ?>
												<a href="<?= site_url('food/'.url_title(strtolower($ct->cusine_type)).''); ?>" ><?= $ct->cusine_type; ?></a>
											 <?php echo $b =='3'  ? '<td>' :''  ?>
											<?php if($b==3){ $b =0 ;}  $b++; endforeach; ?>
										   
										</tr>
									</tbody>
								</table>   
							</div>
						<?php endif ?>
						<div class="city-container">
							<h3>Browse by City</h3>
							<?php $upload_pathcity =  base_url().'upload/city/'; ?>
							<?php $upload_pathlarge = getuploadpath().'city/large/'; ?>
							<?php $uploadpathsmall = getuploadpath().'city/small/'; ?>
							<?php $j = 1; foreach ($city as $cit ): ?>
								

							<?php if ($cit->feature_city): ?>
								
							<?php if ($j=='1' || $j=='4' ): ?>
								<a href="<?= strtolower(site_url('cities/'. url_title($cit->city_name).'/'.url_title($cit->state).'/'.url_title($type).'')) ?>" class="<?= $j==1 || $j == 4 ? 'long-city' : 'city'?>">
									<div class="overlay long-city"></div><h4><?php echo $cit->city_name.' '.$cit->state; ?></h4>
									<img src="<?= $upload_pathlarge.$cit->city_image_url ?>" alt="Get food, alcohol, groceries and laundry delivery in <?php echo $cit->city_name.' '.$cit->state; ?>">
								</a> 
							<?php else: ?>
								<a href="<?= strtolower(site_url('cities/'. url_title($cit->city_name).'/'.url_title($cit->state).'/'.url_title($type).'')) ?>" class="<?= $j==1 || $j == 4 ? 'long-city' : 'city'?>">
									<div class="overlay long-city"></div><h4><?php echo $cit->city_name.' '.$cit->state; ?></h4>
									<img src="<?= $uploadpathsmall.$cit->city_image_url ?>" alt="Get food, alcohol, groceries and laundry delivery in <?php echo $cit->city_name.' '.$cit->state; ?>">
								</a> 
							<?php endif ?>

							<?php endif ?>
							<?php if ($j=='4'): ?>
							<?php $j=0; ?>
							<?php endif ?>
							<?php $j++;


							endforeach ?>

							 <table id="cities-list">
								<tbody>
									<tr>
										<?php $k =1;  foreach ($citylist as $ct): ?>
										<?php echo $k =='1' ? '<td>' :'' ?>
											<a href="<?= strtolower(site_url('cities/'. url_title($ct->city_name).'/'.url_title($ct->state).'/'.url_title($type).'')) ?>" ><?= $ct->city_name.','.$ct->state; ?><span>(<?= $ct->count ?>)</span></a>
										 <?php echo $k =='3'  ? '<td>' :''  ?>
										<?php if($k==3){ $k =0 ;}  $k++; endforeach; ?>
										<!-- <a href="" >See All Cities</a> -->
									</tr>
								</tbody>
							</table>   
						</div>
						

						<div class="category-container">

							<h3>Browse by Category</h3>
							<?php foreach ($categories as $category ): ?>
								
							
							<a href="<?php echo site_url('category/'.url_title($category->type)) ?>">
								<div class="category-img-container">
									<img src="<?= getuploadpath().'category/'.$category->category_image_url; ?>"  class="b-lazy b-loaded catimage" alt="Order food for delivery" >
								</div>
								<h4><?= $category->type ?></h4>
							</a> 
							<?php endforeach ?>

						</div>
					</div>
				</div>
			</div>
		</div>

		
		<div  class="sticky-search" >
			<div class="search-directive-wrapper">
				<div class="help-text">Enter your address
					<span class="desktop-only">&nbsp;to get started</span>
					<span class="icon-quick-search-arrow"></span>
				</div>
				<div  class="search-form sticky-search-form ng-pristine ng-untouched ng-valid">
					<div class="address-search">
						<form id="stickysearch" name="stickysearchform" action="<?= site_url('search') ?>" method="GET">
							<div class="delivery-pickup">

								<span class="delivery-select <?= $pickordelivery =='delivery' ? 'active' : 'inactive' ?>">Delivery
								</span> 
								<input type="checkbox" name="pickordelivery" class="optionpicordel2"  <?= $pickordelivery =='pickup' ? 'checked' : '' ?>  > 
								<span class="pickup-select <?= $pickordelivery =='pickup' ? 'active' : 'inactive' ?>">Pickup</span>
							</div>   
							<div class="dropdown-arrow-wrapper" >

							</div>
							<div class="location-based-search-wrapper ng-pristine ng-untouched ng-valid left-toggle" >
								<div class="location-button-wrapper" ><span  class="icon-location-arrow" ></span><span  class="spinner ng-hide"></span>
								       
								    </div>
								</div>
							<div class="search-autocomplete " >
								<input id="address-search-sticky" required placeholder="Street Address, City, State"    autocomplete="off" tabindex="" type="search">
							</div>

							<input class="field" name="street_number" type="hidden" id="street_number_sticky">
							<input class="field" type="hidden" id="route_sticky" >
							<input class="field" name="city" type="hidden" id="locality_sticky" >
							<input class="field" name="state" type="hidden" id="administrative_area_level_1_sticky" >
							<input class="field" name="zip" type="hidden" id="postal_code_sticky" >
							<input class="field" name="country" type="hidden" id="country_sticky">
							<input name="type" type="hidden" id="typeof" disable="true" value="<?= $type; ?>">
							<button type="submit" class="address-search-submit button primary" tabindex="">Search</button>
							
						</form>
					</div>
				</div>
			</div>
		</div>
	   
	</div> 

<?php echo Modules::run('footer/footer/index'); ?>
<?php if ($type=='cleaner') { ?>
<script type="text/javascript">
$('.laundry-toggle-message').removeClass('ng-hide')
$('.search-autocomplete ').addClass('no-toggle');
$('.main-item-search-container,.delivery-pickup').addClass('ng-hide')
$('.location-based-search-wrapper').removeClass('left-toggle');
$('.search-directive-wrapper').addClass('no-toggle')
</script>
<?php }; ?>
<script type="text/javascript">

$('.tab').click(function(){
	$('.tab').removeClass('active');
	$(this).addClass('active');
	var type = $(this).find('a').attr('title');
	$('#typeof').val(type);
	$('#type').val(type);
	data = {
		type:$(this).find('a').attr('title')
	};
	$.ajax({
	    url : "<?php echo site_url('index/setType') ?>",
	    type: "POST",
	    data: data,
	    success:function(data){
	    	if (type=='cleaner') {
	    		$('.laundry-toggle-message').removeClass('ng-hide')
	    		$('.search-autocomplete ').addClass('no-toggle');
	    		$('.main-item-search-container,.delivery-pickup').addClass('ng-hide')
	    		$('.location-based-search-wrapper').removeClass('left-toggle');
	    		$('.search-directive-wrapper').addClass('no-toggle')
	    	}else{
	    		$('.laundry-toggle-message').addClass('ng-hide')
	    		$('.search-autocomplete ').removeClass('no-toggle')
	    		$('.location-based-search-wrapper').addClass('left-toggle');
	    		$('.main-item-search-container,.delivery-pickup').removeClass('ng-hide')
	    		$('.search-directive-wrapper').removeClass('no-toggle')
	    	};
	    	$('#browse-by-container').html(data)
	    }
	});
});

$(document).ready(function() {
    $(".home-tabs a").click(function(event) {
        event.preventDefault();
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
        var tab = $(this).attr("href");
        $(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });
});
var elems = Array.prototype.slice.call(document.querySelectorAll('.optionpicordel'));
	elems.forEach(function(html) {
	  var switchery = new Switchery(html ,{ color: '#6886aa', secondaryColor: '#6886aa', size: 'small' });
	});

	
	$('.optionpicordel').change(function(){
		var a = $('.optionpicordel').prop('checked');
		if(a){
			$('.pickup-select').removeClass('inactive');
			$('.pickup-select').addClass('active');
			$('.delivery-select').addClass('inactive');
		}else{
			$('.delivery-select').removeClass('inactive');
			$('.delivery-select').addClass('active');
			$('.pickup-select').addClass('inactive');
		}
		
		data ={
			pickordelivery : a
		}
		$.ajax({
			type: "POST",
			url: "<?php echo site_url('setOptiondelorpic') ?>",
			data: data,
			dataType:"json",
			beforeSend: function(){
			},
			success: function(data) {
				
			}
		})
	});
	var elems = Array.prototype.slice.call(document.querySelectorAll('.optionpicordel2'));
elems.forEach(function(html) {
var switchery = new Switchery(html ,{ color: '#6886aa', secondaryColor: '#6886aa', size: 'small' });
});
	$('.optionpicordel2').change(function(){
        var a = $('.optionpicordel2').prop('checked');
        if(a){
            $('.pickup-select').removeClass('inactive');
            $('.pickup-select').addClass('active');
            $('.delivery-select').addClass('inactive');
        }else{
            $('.delivery-select').removeClass('inactive');
            $('.delivery-select').addClass('active');
            $('.pickup-select').addClass('inactive');
        }
        
        data ={
            pickordelivery : a
        }
        $.ajax({
            type: "POST",
            url: "<?php echo site_url('setOptiondelorpic') ?>",
            data: data,
            dataType:"json",
            beforeSend: function(){
            },
            success: function(data) {
                
            }
        })
    });
</script>