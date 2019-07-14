
<?php
/**
 * Plugin Name: ECommerce
 * Plugin URI: http://www.mywebsite.com/my-first-plugin
 * Description: ECommerce for FIMC
 * Version: 1.0
 * Author: FIMC Dev Team
 * Author URI: http://www.mywebsite.com
 */

function my_scripts_method() {
  wp_enqueue_script('jsscript1', plugins_url( 'bootstrap/js/bootstrap.min.js' , __FILE__ ), array( 'jquery' ));
  wp_enqueue_script('jsscript2', plugins_url( 'bootstrap/js/bootstrap-datetimepicker.js' , __FILE__ ), array( 'jquery' ));
	wp_enqueue_script('jsscript3', plugins_url( 'js/script.js' , __FILE__ ), array( 'jquery' ));
}
add_action( 'wp_enqueue_scripts', 'my_scripts_method' );
// First we register our resources using the init hook
function prefix_register_resources() {
	//wp_register_script("prefix-script", plugins_url("js/script.js", __FILE__), array(), "1.0", false);
  
  wp_register_style("prefix-bootstrap-style1", plugins_url("bootstrap/css/bootstrap.min.css", __FILE__), array(), "1.0", "all");   
  wp_register_style("prefix-bootstrap-style2", plugins_url("bootstrap/css/bootstrap-datetimepicker.min.css", __FILE__), array(), "1.0", "all");
  wp_register_style("prefix-bootstrap-style3", plugins_url("bootstrap/css/bootstrap-grid.min.css", __FILE__), array(), "1.0", "all");
  wp_register_style("prefix-bootstrap-style4", plugins_url("bootstrap/css/bootstrap-reboot.min.css", __FILE__), array(), "1.0", "all");
	wp_register_style("prefix-google-style", plugins_url("css/google-style.css", __FILE__), array(), "1.0", "all");
	wp_register_style("prefix-style", plugins_url("css/style.css", __FILE__), array(), "1.0", "all");
}
add_action( 'init', 'prefix_register_resources' );
 
// Then we define our shortcode and enqueue the resources defined above
 function LoadFirstScreen( $atts ) {
	wp_enqueue_script("prefix-script");
	wp_enqueue_style("prefix-bootstrap-style1");
	wp_enqueue_style("prefix-bootstrap-style2");
	wp_enqueue_style("prefix-bootstrap-style3");
	wp_enqueue_style("prefix-bootstrap-style4");
  wp_enqueue_style("prefix-google-style");
	wp_enqueue_style("prefix-style");
	 // turn on output buffering to capture script output
	
	 ob_start();
	 
		// include file (contents will get saved in output buffer)
		 
		include('design/firstscreen.html');
	 
		// save and return the content that has been output
	 
		$content = ob_get_clean();
		return $content; 

	// extract(shortcode_atts( array(
	//    'name' => ''
	// ), $atts ));
	// return 'Hello '.$name.' !';
 }
 add_shortcode( 'divFirstScreen', 'LoadFirstScreen' );

 ?>