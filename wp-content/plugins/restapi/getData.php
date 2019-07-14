<?php
/**
 * Plugin Name: Login Form
 * Plugin URI: http://www.mywebsite.com/my-first-plugin
 * Description: Login Form
 * Version: 1.0
 * Author: Nitin Kharade
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
	//$content .= '<button id="btnServiceCall" class="et_pb_button et_pb_button_0 et_pb_bg_layout_light">Call Service</button><div class="serviceData"></div>';	
	//return $content;
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

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-US" lang="en-US">
<head>
</head>
<body>
<form id="login_form" action="" method="post">
	<fieldset>
		<p>
			<label for="user_Login">Username</label>
			<input name="user_login" id="txtUserName" class="required" type="text"/>
		</p>
		<p>
			<label for="user_pass">Password</label>
			<input name="user_pass" id="txtPassword" class="required" type="password"/>
		</p>
		<p>
			<input type="hidden" name="login_nonce" value=""/>
			<input id="btnServiceCall" type="button" value="Login" />
		</p>
		<p>
			<span class="lblErrMsg"></span>
		</p>
	</fieldset>
</form>
</body>
</html>