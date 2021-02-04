<!DOCTYPE html>
<html lang="en" >
<head>
	<meta charset="utf-8"/>
	<title>@yield('page-title')</title>
	<meta name="description" content="Latest updates and statistic charts"> 
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<!--begin::Fonts -->
	<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js"></script>
	<script>
		WebFont.load({
			google: {"families":["Poppins:300,400,500,600,700","Roboto:300,400,500,600,700"]},
			active: function() {
				sessionStorage.fonts = true;
			}
		});
	</script>
	<style>
		.dropdown {
			position: relative;
			display: inline-block;
		}

		.dropdown-content {
			display: none;
			position: absolute;
			background-color: #f1f1f1;
			min-width: 160px;
			box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
			z-index: 1;
		}

		.dropdown-content a {
			color: black;
			padding: 12px 16px;
			text-decoration: none;
			display: block;
		}

		.dropdown-content a:hover {background-color: #ddd;}

		.dropdown:hover .dropdown-content {display: block;}
	</style>
	<!--end::Fonts -->
	<!--begin::Page Vendors Styles(used by this page) -->
	<link href="{{ URL::asset('assets/asset/vendors/custom/fullcalendar/fullcalendar.bundle.css') }}" rel="stylesheet" type="text/css" />
	<!--end::Page Vendors Styles -->
	<!--begin::Global Theme Styles(used by all pages) -->
	<link href="{{ URL::asset('assets/asset/vendors/global/vendors.bundle.css') }}" rel="stylesheet" type="text/css" />
	<link href="{{ URL::asset('assets/asset/css/style.bundle.css') }}" rel="stylesheet" type="text/css" />
	<!--end::Global Theme Styles -->
	<!--begin::Layout Skins(used by all pages) -->
	<link href="{{ URL::asset('assets/asset/css/style.css') }}" rel="stylesheet" type="text/css" />
	<link href="{{ URL::asset('assets/asset/plugin/datatables/datatables.bundle.css') }}" rel="stylesheet" type="text/css" />
	<!--end::Layout Skins -->
	<link rel="shortcut icon" href="{{ URL::asset('assets/asset/media/logos/favicon.png') }}" type="image/png"/>
	<link href="{{ URL::asset('assets/asset/css/lightgallery.css') }}" rel="stylesheet" type="text/css" />
	<link href="{{ URL::asset('assets/asset/css/datatables.bundle.css') }}" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<!-- end::Head -->
<!-- begin::Body -->
<body  class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--transparent kt-aside--enabled kt-aside--fixed kt-aside--minimize kt-page--loading"  >
	<!-- begin:: Page -->
	<!-- begin:: Header Mobile -->
	<div id="kt_header_mobile" class="kt-header-mobile  kt-header-mobile--fixed " >
		<div class="kt-header-mobile__logo">
			<a href="{{ route('dashboard') }}">
				<img alt="Logo" src="{{ URL::asset('assets/media/logos/logo-7.png') }}" style="width: 30%;" />
			</a>
		</div>
		<div class="kt-header-mobile__toolbar">
			<button class="kt-header-mobile__toolbar-toggler" id="kt_header_mobile_toggler"><span></span></button>
			<button class="kt-header-mobile__toolbar-topbar-toggler" id="kt_header_mobile_topbar_toggler"><i class="flaticon-more"></i></button>
		</div>
	</div>
	<!-- end:: Header Mobile -->
	<div class="kt-grid kt-grid--hor kt-grid--root">
		<div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
			<div class="kt-aside-menu-overlay"></div>
			<!-- end:: Aside -->
			<div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
				<!-- begin:: Header -->
				<div id="kt_header" class="kt-header kt-grid kt-grid--ver  kt-header--fixed " >
					<div class="kt-header-menu kt-header-menu-mobile  kt-header-menu--layout- "  >
						<div class="kt-aside__brand kt-grid__item " id="kt_aside_brand">
							<div class="kt-aside__brand-logo">
								<a href="{{ route('user-dashboard',$id) }}">
									<img alt="Logo" src="{{ URL::asset('assets/media/logos/logo-7.png') }}" style="width: 50%;">
								</a>
							</div>
						</div>
					</div>
					<button class="kt-header-menu-wrapper-close" id="kt_header_menu_mobile_close_btn"><i class="la la-close"></i></button>
					<div class="kt-header-menu-wrapper kt-grid__item kt-grid__item--fluid" id="kt_header_menu_wrapper">
						<div id="kt_header_menu" class="kt-header-menu kt-header-menu-mobile  kt-header-menu--layout- "  >
							<ul class="kt-menu__nav ">
								<li class="kt-menu__item  kt-menu__item--active" aria-haspopup="true">
									<a href="{{ route('user-dashboard',$id) }}" class="kt-menu__link ">
										<span class="kt-menu__link-text">Dashboard</span>
									</a>
								</li>

								<li class="kt-menu__item" aria-haspopup="true"><a href="{{ route('user-registration',$id) }}" class="kt-menu__link"><span class="kt-menu__link-text">Registration</span></a></li>

								<li class="kt-menu__item" aria-haspopup="true"><a href="{{ route('user-ledger-account',$id) }}" class="kt-menu__link"><span class="kt-menu__link-text">Ledger Account</span></a></li>

								<li class="kt-menu__item" aria-haspopup="true"><a href="{{ route('user-sahyognidhi-request',$id) }}" class="kt-menu__link"><span class="kt-menu__link-text">Sahyognidhi</span></a></li>

								<li class="kt-menu__item" aria-haspopup="true"><a href="{{ route('user-repayment',$id) }}" class="kt-menu__link"><span class="kt-menu__link-text">Repayment</span></a></li>

								<li class="kt-menu__item" aria-haspopup="true"><a href="{{ route('user-transfer',$id) }}" class="kt-menu__link"><span class="kt-menu__link-text">Transfer</span></a></li>						
								<li class="kt-menu__item" aria-haspopup="true"><a href="{{ route('user-ach',$id) }}" class="kt-menu__link"><span class="kt-menu__link-text">Ach</span></a></li>	

							</ul>
						</div>
					</div>
					<!-- end: Header Menu -->   
					<!-- begin:: Header Topbar -->
					<div class="kt-header__topbar">
						<!--begin: Notifications -->
						<div class="kt-header__topbar-item dropdown">
							<div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px" onclick="function1()">
								<span class="kt-header__topbar-icon kt-header__topbar-icon--success"><i class="flaticon2-bell-alarm-symbol" id="alermNotification" id="read_notification"><sup id="total_notification" style="color: red;"></i></span>
								<span class="kt-hidden kt-badge kt-badge--danger"></span>
							</div>
							{{-- <div id="myDropdown" class="dropdown-content">
								<div class="notifications_01">
									<div class="notifications_drop_title">
										<h4>User Notifications</h4>
									</div>
								</div>
								<div class="notifications_drop_section">
									<ul id="html_data" style="min-height: 240px;"></ul>
									<div>
										<a href="" class="btn notification"><button class="btn btn-primary">View All</button></a>
									</div>
								</div>
							</div> --}}{{-- dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl --}}
							 <div class="dropdown-content dropdown-content-fit dropdown-content-right dropdown-content-anim dropdown-content-xl" style="margin-left: -200px;margin-top: 70px;width: 300px;">
								<form>
									<!--begin: Head -->
									<div class="kt-head kt-head--skin-light kt-head--fit-x kt-head--fit-b">
										<h3 class="kt-head__title">
											User Notifications 
											&nbsp;
											<span id="user_notification"></span> 
											 {{-- <span class="btn btn-label-primary btn-sm btn-bold btn-font-md" id="total_notification" id="user_notification">0 new</span> --}} 
										</h3>
										<ul class="nav nav-tabs nav-tabs-line nav-tabs-bold nav-tabs-line-3x nav-tabs-line-brand  kt-notification-item-padding-x" role="tablist">
											<li class="nav-item">
												<a class="nav-link active show" data-toggle="tab" href="#topbar_notifications_notifications" role="tab" aria-selected="true">Alerts</a>
											</li>
											<li class="nav-item">
												<a class="nav-link" data-toggle="tab" href="#topbar_notifications_events" role="tab" aria-selected="false">Events</a>
											</li>
											<li class="nav-item">
												<a class="nav-link" data-toggle="tab" href="#topbar_notifications_logs" role="tab" aria-selected="false">Logs</a>
											</li>
										</ul>
									</div>
									<!--end: Head -->
									 <div class="tab-content">
										<div class="tab-pane active show" id="topbar_notifications_notifications" role="tabpanel">
											<div class="kt-notification kt-margin-t-10 kt-margin-b-10 kt-scroll" data-scroll="true" data-height="300" data-mobile-height="200">
												<a href="#" class="kt-notification__item" id="notification" style="text-decoration: none;">
													{{-- <div class="kt-notification__item-icon">
														<i class="flaticon2-line-chart kt-font-success"></i>
													</div> --}}
													<div class="kt-notification__item-details" id="get_notification">
														{{-- <div class="kt-notification__item-title">
															New order has been received
														</div>
														<div class="kt-notification__item-time">
															2 hrs ago
														</div> --}}
													</div>
												</a>
												<a href="#" class="kt-notification__item" id="notification1" style="text-decoration: none;">
													{{-- <div class="kt-notification__item-icon">
														<i class="flaticon2-line-chart kt-font-success"></i>
													</div> --}}
													<div class="kt-notification__item-details" id="get_notification1">
														{{-- <div class="kt-notification__item-title">
															New order has been received
														</div>
														<div class="kt-notification__item-time">
															2 hrs ago
														</div> --}}
													</div>
												</a>
											</div>
										</div>
										<div class="tab-pane" id="topbar_notifications_events" role="tabpanel">
											<div class="kt-notification kt-margin-t-10 kt-margin-b-10 kt-scroll" data-scroll="true" data-height="300" data-mobile-height="200">
												<a href="#" class="kt-notification__item">
													<div class="kt-notification__item-icon">
														<i class="flaticon2-psd kt-font-success"></i>
													</div>
													<div class="kt-notification__item-details">
														<div class="kt-notification__item-title">
															New report has been received
														</div>
														<div class="kt-notification__item-time">
															23 hrs ago
														</div>
													</div>
												</a>
											</div>
										</div>
										<div class="tab-pane" id="topbar_notifications_logs" role="tabpanel">
											<div class="kt-grid kt-grid--ver" style="min-height: 200px;">
												<div class="kt-grid kt-grid--hor kt-grid__item kt-grid__item--fluid kt-grid__item--middle">
													<div class="kt-grid__item kt-grid__item--middle kt-align-center">
														All caught up!
														<br>No new notifications.
													</div>
												</div>
											</div>
										</div>
									</div> 
								</form>
							</div>
						</div>
						<!--end: Notifications -->  
						<!--begin: Quick actions -->

						<div class="kt-header__topbar-item" style="margin:auto;">
							<div class="dropdown">
								<a href="{{ route('logout') }}" class="kt-menu__link" title="Logout"><span class="kt-menu__link-text" style="color: #8a88a2; font-weight: 500;"><i class="fas fa-user"></i></span></a>
							</div>
						</div>
						<!--end: Quick actions -->
						<!--begin: User bar -->
						{{-- <div class="kt-header__topbar-item kt-header__topbar-item--user">
							<div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">           
								<span class="kt-hidden kt-header__topbar-welcome">Hi,</span>
								<span class="kt-hidden kt-header__topbar-username">Nick</span>
								<img class="kt-hidden" alt="Pic" src="{{ URL::asset('assets/media/users/300_25.jpg') }}"/>
								<span class="kt-header__topbar-icon"><i class="flaticon2-user-outline-symbol"></i></span>
							</div>
							 <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl">
								<!--begin: Head -->
								<div class="kt-user-card kt-user-card--skin-light kt-notification-item-padding-x">
									<div class="kt-user-card__avatar">
										<img class="kt-hidden-" alt="Pic" src="{{ URL::asset('assets/media/users/300_25.jpg') }}" />
										<!--use below badge element instead the user avatar to display username's first letter(remove kt-hidden class to display it) -->
										<span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold kt-hidden">S</span>
									</div>
									<div class="kt-user-card__name">
										Sean Stone
									</div>
									<div class="kt-user-card__badge">
										<span class="btn btn-label-primary btn-sm btn-bold btn-font-md">23 messages</span>
									</div>
								</div>
								<!--end: Head -->
								<!--begin: Navigation -->
								<div class="kt-notification">
									<a href="#" class="kt-notification__item">
										<div class="kt-notification__item-icon">
											<i class="flaticon2-calendar-3 kt-font-success"></i>
										</div>
										<div class="kt-notification__item-details">
											<div class="kt-notification__item-title kt-font-bold">
												My Profile
											</div>
											<div class="kt-notification__item-time">
												Account settings and more
											</div>
										</div>
									</a>
									<a href="#" class="kt-notification__item">
										<div class="kt-notification__item-icon">
											<i class="flaticon2-mail kt-font-warning"></i>
										</div>
										<div class="kt-notification__item-details">
											<div class="kt-notification__item-title kt-font-bold">
												My Messages
											</div>
											<div class="kt-notification__item-time">
												Inbox and tasks
											</div>
										</div>
									</a>
									<a href="#" class="kt-notification__item">
										<div class="kt-notification__item-icon">
											<i class="flaticon2-rocket-1 kt-font-danger"></i>
										</div>
										<div class="kt-notification__item-details">
											<div class="kt-notification__item-title kt-font-bold">
												My Activities
											</div>
											<div class="kt-notification__item-time">
												Logs and notifications
											</div>
										</div>
									</a>
									<a href="#" class="kt-notification__item">
										<div class="kt-notification__item-icon">
											<i class="flaticon2-hourglass kt-font-brand"></i>
										</div>
										<div class="kt-notification__item-details">
											<div class="kt-notification__item-title kt-font-bold">
												My Tasks
											</div>
											<div class="kt-notification__item-time">
												latest tasks and projects
											</div>
										</div>
									</a>
									<a href="#" class="kt-notification__item">
										<div class="kt-notification__item-icon">
											<i class="flaticon2-cardiogram kt-font-warning"></i>
										</div>
										<div class="kt-notification__item-details">
											<div class="kt-notification__item-title kt-font-bold">
												Billing
											</div>
											<div class="kt-notification__item-time">
												billing & statements <span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill kt-badge--rounded">2 pending</span>
											</div>
										</div>
									</a>
									<div class="kt-notification__custom kt-space-between">
										<a href="{{ route('logout') }}" class="btn btn-label btn-label-brand btn-sm btn-bold">Sign Out</a>
										<a href="custom/user/login-v2.html" target="_blank" class="btn btn-clean btn-sm btn-bold">Upgrade Plan</a>
									</div>
								</div>
								<!--end: Navigation -->     
							</div> 
						</div> --}}
						<!--end: User bar -->
					</div>
					<!-- end:: Header Topbar -->
				</div>
				<!-- end:: Header -->
				@yield('content')
				<!-- begin:: Footer -->
				<div class="kt-footer  kt-grid__item kt-grid kt-grid--desktop kt-grid--ver-desktop"  id="kt_footer">
					<div class="kt-container  kt-container--fluid ">
						<div class="kt-footer__copyright">
							2019&nbsp;&copy;&nbsp;<a href="#" class="kt-link">Yuva Sangh</a>
						</div>
						<div class="kt-footer__menu">
							<a href="#" class="kt-footer__menu-link kt-link">About</a>
							<a href="#" class="kt-footer__menu-link kt-link">Team</a>
							<a href="#" class="kt-footer__menu-link kt-link">Contact</a>
						</div>
					</div>
				</div>
				<!-- end:: Footer -->   
				<div class="table-container" id="res" style="display: none;"></div>        
			</div>
		</div>
	</div>
	<!--ENd:: Chat-->
	<!-- begin::Global Config(global config for global JS sciprts) -->
	<script>
		var KTAppOptions = {"colors":{"state":{"brand":"#22b9ff","light":"#ffffff","dark":"#282a3c","primary":"#5867dd","success":"#34bfa3","info":"#36a3f7","warning":"#ffb822","danger":"#fd3995"},"base":{"label":["#c5cbe3","#a1a8c3","#3d4465","#3e4466"],"shape":["#f0f3ff","#d9dffa","#afb4d4","#646c9a"]}}};
	</script>
	<!-- end::Global Config -->
	<!--begin::Global Theme Bundle(used by all pages) -->
	<script src="{{ URL::asset('assets/asset/vendors/global/vendors.bundle.js') }}" type="text/javascript"></script>

	<script src="{{ URL::asset('assets/asset/js/vendors.bundle.js') }}" type="text/javascript"></script>
	<script src="{{ URL::asset('assets/asset/js/scripts.bundle.js') }}" type="text/javascript"></script>
	<!--end::Global Theme Bundle -->
	<!--begin::Page Vendors(used by this page) -->
	<script src="{{ URL::asset('assets/asset/vendors/custom/fullcalendar/fullcalendar.bundle.js') }}" type="text/javascript"></script>
	<script src="http://maps.google.com/maps/api/js?key=AIzaSyBTGnKT7dt597vo9QgeQ7BFhvSRP4eiMSM" type="text/javascript"></script>
	<script src="{{ URL::asset('assets/asset/vendors/custom/gmaps/gmaps.js') }}" type="text/javascript"></script>
	<!--end::Page Vendors -->
	<!--begin::Page Scripts(used by this page) -->
	
	<script src="{{ URL::asset('assets/asset/plugin/datatables/datatables.bundle.js') }}" type="text/javascript"></script>
	<script src="{{ URL::asset('assets/asset/js/bootstrap-datepicker.js') }}" type="text/javascript"></script>
	<script src="{{ URL::asset('assets/asset/js/datatables.bundle.js') }}" type="text/javascript"></script>
	<script src="{{ URL::asset('assets/asset/js/select2.js') }}" type="text/javascript"></script>
	<script src="{{ URL::asset('assets/asset/js/dashboard.js') }}" type="text/javascript"></script>
	<script src="{{ URL::asset('assets/asset/js/dropzone.js') }}" type="text/javascript"></script>
	<script src="{{ URL::asset('assets/asset/js/lightgallery-all.js') }}" type="text/javascript"></script>
	
	<script type="text/javascript">
		$(".dateselect").datepicker({
			format: 'dd-mm-yyyy',
			orientation: "bottom left",
			todayHighlight:true
		}).on('change', function(){
			$('.datepicker').hide();
		});
	</script>
	<script type="text/javascript">
		$(document).ready(function() {
			$('#today_datatable').DataTable({
				stateSave: true,
				"bDestroy": true,
				"ordering": false
			});
		} );
	</script>
	<script type="text/javascript">
		$(document).ready(function() {
			$('#today_datatable1').DataTable({
				stateSave: true,
				"bDestroy": true,
				"ordering": false
			});
		} );
	</script>
	<script>
		function getNotification() {
			$('#alermNotification').html();
		}
	</script>
	{{-- setInterval --}}
	<script>
		setTimeout(function() { 
			$(document).ready(function() {
				$.ajax({
					url:"{{ route('change-minor-account') }}",
					method:"GET",
					success:function(response){
						var obj = JSON.parse(response);
						if(obj.success == 1){
							$('#total_notification').html(obj.total_notification);
							$('#user_notification').html(obj.html_data);
							if (obj.html_statuss != '' && obj.html_status != '') {
								$('#get_notification').html(obj.html_statuss);
								$('#get_notification1').html(obj.html_status);
							}
							else if(obj.html_statuss != ''){
								$('#get_notification').html(obj.html_statuss);
								$('#notification1').hide();
							}
							else{
								$('#notification').hide();
								//$('#get_notification').html(obj.html_statuss);
								$('#get_notification1').html(obj.html_status);
							}
							
							/*$('#alert_notification').show();*/
						}
						else{
							$('#total_notification').html(obj.total_notification);
							$('#user_notification').html(obj.html_data);
							$('#get_notification').html(obj.html_status);
							$('#notification1').hide();
						}
					}
				});
			});


			$(document).ready(function() {
				$("#read_notification").on('click', function(event) {
					event.preventDefault();
					$.ajax({
						url: '',
						type: 'GET',
						success:function(data) {
						}
					});

				});
			});

		}, 1000);
	</script>


	<!--end::Page Scripts -->
	@yield('content_js')
</body>
<!-- end::Body -->
<!-- Mirrored from keenthemes.com/metronic/preview/demo7/ by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 18 Jul 2019 09:49:22 GMT -->
</html>