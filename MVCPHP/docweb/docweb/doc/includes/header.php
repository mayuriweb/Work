

<?php 
session_start();
include("../config/dbconnect.php");

//error_reporting(0);
?>

<header>
            
            <div class="header-bg">
            
            <div id="search-overlay">
            <div class="container">
        						<div id="close">X</div>
        	
        						<input id="hidden-search" type="text" placeholder="Start Typing..." autofocus autocomplete="off"  /> <!--hidden input the user types into-->
        						<input id="display-search" type="text" placeholder="Start Typing..." autofocus autocomplete="off" /> <!--mirrored input that shows the actual input value-->
        					</div></div>
               
                	
                    <!--Topbar-->
                    <div class="topbar-info no-pad">                    
                        <div class="container">                     
                            <div class="social-wrap-head col-md-2 no-pad">
                                <ul>
                                <li><a href="#"><i class="icon-facebook head-social-icon" id="face-head" data-original-title="" title=""></i></a></li>
                                <li><a href="#"><i class="icon-social-twitter head-social-icon" id="tweet-head" data-original-title="" title=""></i></a></li>
                                <li><a href="#"><i class="icon-google-plus head-social-icon" id="gplus-head" data-original-title="" title=""></i></a></li>
                                <li><a href="#"><i class="icon-linkedin head-social-icon" id="link-head" data-original-title="" title=""></i></a></li>
                                <li><a href="#"><i class="icon-rss head-social-icon" id="rss-head" data-original-title="" title=""></i></a></li>
                                </ul>
                            </div>                            
                            <div class="top-info-contact pull-right col-md-6">
                           
         <h4 style="color:#107FC9;"><?php if ($_SESSION['username']!= ''){ echo "Welcome:". $_SESSION['username'];
			
		  }?></h4>
        
        
        
    <div id="search" class="fa fa-search search-head"></div>
                            </div>                      
                        </div>
                    </div><!--Topbar-info-close-->
                    
                    
                    
                    
                    
                    <div id="headerstic">
                    
                    <div class=" top-bar container">
                    
                    
                    
                    	<div class="row">
                            <nav class="navbar navbar-default" role="navigation">
                              <div class="container-fluid">
                                <!-- Brand and toggle get grouped for better mobile display -->
                                <div class="navbar-header">
                          
                          <button type="button" class="navbar-toggle icon-list-ul" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span class="sr-only">Toggle navigation</span>
                          </button>
                          <button type="button" class="navbar-toggle icon-rocket" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2">
                            <span class="sr-only">Toggle navigation</span>
                          </button>

                          <a href="index.html"><div class="logo"></div></a>
                        </div>
                            
                    <!-- Collect the nav links, forms, and other content for toggling -->
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						<ul class="nav navbar-nav navbar-right">
                            <li class="active"><a href="index.php" ><i class="icon-home"></i>Home</a>
								<!--<ul class="dropdown-menu">
                                    <li><a href="home-page-1.html">Home Page 1</a></li>
									<li><a href="home-page-2.html">Home Page 2</a></li>
									<li><a href="home-page-3.html">Home Page 3</a></li>
									<li><a href="home-page-4.html">Home Page 4</a></li>
									<li><a href="home-page-5.html">Home Page 5</a></li>
									<li><a href="home-page-6.html">Home Page 6</a></li>
									<li><a href="home-page-7.html">Home Page 7</a></li>
									<li><a href="home-page-8.html">Home Page 8</a></li>
                                </ul>-->
							</li>

                            <li class="dropdown"><a href="showappo.php" ><i class="icon-cog"></i> Booked Appointment<b class="icon-angle-down"></b></a>
                                <ul class="dropdown-menu">
                                	<li ><a href="conappointment.php">Confirm Appointment</a>
										
		                            </li>
                                    </ul>
                            </li>
                            
                            <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-file"></i>Reports<b class="icon-angle-down"></b></a>
                                <ul class="dropdown-menu">
                                	<li ><a href="#">Revanue</a>
										
		                            </li>
		                            <li ><a href="#">Time</a>
										
		                            </li>
                                    <li><a href="patientinfo.php">Patient</a></li>
                                    
										
		                            </li>
                                    <li><a href="custom.php">Customization</a></li>
                                    
								</ul>
                            </li>
                            
                            <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-camera"></i>UpComming<b class="icon-angle-down"></b></a>
                                <ul class="dropdown-menu">
                                	<li class="dropdown left-dropdown"><a href="addoutlet.php">New Outlet</a>
										
		                            </li>
		                            <li class="dropdown left-dropdown"><a href="timeconsum.php">Time Consuming</a>
										
		                            </li>
		                            <li class="dropdown left-dropdown"><a href="addcamp.php">Camp Or Free Checkup</a>
										
		                            </li>
		                            <li class="dropdown left-dropdown"><a href="addnews.php">News</a>
										
		                            </li>
                                     <li class="dropdown left-dropdown"><a href="#">Warning and Danger</a>
										
		                            </li>
                                </ul>
                            </li>
                            
                            <li class="dropdown"><a href="review.php"><i class="icon-pencil"></i>Review<b class="icon-angle-down"></b></a>
                                <!--<ul class="dropdown-menu">
                                	<li class="dropdown left-dropdown"><a href="#">Blog Masonry</a>
										<ul class="dropdown-menu">
											<li><a href="blog-masonry-full-width.html">Full Width</a></li>
		                                    <li><a href="blog-masonry-left-sidebar.html">Left Sidebar</a></li>
		                                    <li><a href="blog-masonry-right-sidebar.html">Right Sidebar</a></li> 
		                                </ul>
		                            </li>
		                            <li class="dropdown left-dropdown"><a href="#">Blog Medium Image</a>
										<ul class="dropdown-menu">
											<li><a href="blog-medium-full-width.html">Full Width</a></li>
											<li><a href="blog-medium-left-sidebar.html">Left Sidebar</a></li>
											<li><a href="blog-medium-right-sidebar.html">Right Sidebar</a></li>
		                                </ul>
		                            </li>
									<li class="dropdown left-dropdown"><a href="#">Blog Large Image</a>
										<ul class="dropdown-menu">
											<li><a href="blog-full-width.html">Blog Full Width</a></li>
											<li><a href="blog-left-sidebar.html">Blog Left Sidebar</a></li>
											<li><a href="blog-right-sidebar.html">Blog Right Sidebar</a></li>
		                                </ul>
		                            </li>					
									<li><a href="blog-with-slider.html">Blog With Slider</a></li>
									<li class="dropdown left-dropdown"><a href="#">Blog Single Post</a>
										<ul class="dropdown-menu">
											<li><a href="blog-image-post.html">Image Post</a></li>
											<li><a href="blog-gallery-post.html">Gallery Post</a></li>
											<li><a href="blog-video-post.html">Video Post</a></li>
											<li><a href="blog-full-width-post.html">Full Width Post</a></li>
		                                </ul>
		                            </li>	
                                  </ul>-->
                            </li>
                            
                            <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-envelope"></i>Contact Us<b class="icon-angle-down"></b></a>
                                <ul class="dropdown-menu">
                                    <li><a href="contact-1.html">Contact Version 1</a></li>
                                    <li><a href="contact-2.html">Contact Version 2</a></li>
                                    <li><a href="contact-3.html">Contact Version 3</a></li>
                                </ul>
                            </li>
                             <?php if ($_SESSION['username']== ""){?>                 
        <li><a class="button" href="#" >SignIn</a></li>
        <?php }else{?>
        <li><a   href="logout.php" >Logout</a></li>
        <?php }?>
                        </ul>
                    </div><!-- /.navbar-collapse -->
                                
                                
                                <div class="hide-mid collapse navbar-collapse option-drop" id="bs-example-navbar-collapse-2">
                                  
                                  
                                  <ul class="nav navbar-nav navbar-right other-op">
                                    <li><i class="icon-phone2"></i>+91 9028556688</li>
                                    <li><i class="icon-mail"></i><a href="#" class="mail-menu">demo@companyname.com</a></li>
                                    
                                    <li><i class="icon-globe"></i>
                                        <a href="#" class="mail-menu"><i class="icon-facebook"></i></a>
                                        <a href="#" class="mail-menu"><i class="icon-google-plus"></i></a>
                                        <a href="#" class="mail-menu"><i class="icon-linkedin"></i></a>
                                        <a href="#" class="mail-menu"><i class="icon-social-twitter"></i></a>
                                    </li>
                                    <li><i class="icon-search"></i>
                                    <div class="search-wrap"><input type="text" id="search-text" class="search-txt" name="search-text">
                                    <button id="searchbt" name="searchbt" class="icon-search search-bt"></button></div>
                                    </li>
                                    
                                  </ul>
                                </div><!-- /.navbar-collapse -->
                                
                                <div class="hide-mid collapse navbar-collapse cart-drop" id="bs-example-navbar-collapse-3">

                                  
                                  
                                  <ul class="nav navbar-nav navbar-right">
                                    <li><a href="#"><i class="icon-cart"></i>0 item(s) - $0.00</a></li>
                                    <li><a href="#"><i class="icon-user"></i>My Account</a></li>
                                  </ul>
                                </div><!-- /.navbar-collapse -->
                                
                                
                                
                              </div><!-- /.container-fluid -->
                            </nav>
                    	</div>    
                    </div><!--Topbar End-->
                	</div>
                    
                    
                    
                    
                    
                    
                    
              </div>
            </header>