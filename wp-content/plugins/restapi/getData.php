<?php
/**
 * Plugin Name: Thanks for reading
 * Plugin URI: http://www.mywebsite.com/my-first-plugin
 * Description: The very first plugin that I have ever created.
 * Version: 1.0
 * Author: Kaustubh Patil
 * Author URI: http://www.mywebsite.com
 */
 function my_scripts_method() {
	wp_enqueue_script(
		'jsscript',
		plugins_url( '/js/jquery.js' , __FILE__ ),
		array( 'jquery' )
	  );
	}
	add_action( 'wp_enqueue_scripts', 'my_scripts_method' );
 
add_action( 'the_content', 'my_thank_you_text' );	
function my_thank_you_text ( $content ) {
//  $api = wp_remote_get("https://reqres.in/api/users");
//     $json_api = json_decode(stripslashes($api['body']));
// 	foreach($json_api->data as $row){
// 		$content .=  '<br/>id: '.$row->id.' email:'.$row->email.' first_name:'.$row->first_name.' last_name:'.$row->last_name;
// 	}
		$content.='<button id="btnServiceCall" class="et_pb_button et_pb_button_0 et_pb_bg_layout_light">Call Service</button><div class="serviceData"></div>';	
    return $content;
}


function console_log($output, $with_script_tags = true) {
    $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . 
');';
    if ($with_script_tags) {
        $js_code = '<script>' . $js_code . '</script>';
    }
    echo $js_code;
}

?>