<?php

define( 'GD_VIP', '166.62.112.219' );
define( 'GD_RESELLER', 1 );
define( 'GD_ASAP_KEY', '14ee396aef4f085d49fa10c93b2aac35' );
define( 'GD_STAGING_SITE', false );
define( 'GD_EASY_MODE', true );
define( 'GD_SITE_CREATED', 1561706064 );
define( 'GD_ACCOUNT_UID', '226e85fd-e271-46f2-841f-86fe62886bf0' );
define( 'GD_SITE_TOKEN', '7f7587ea-ec54-42d7-b242-0af6c2c20034' );
define( 'GD_TEMP_DOMAIN', 'mng.b0b.myftpupload.com' );
define( 'GD_CDN_ENABLED', TRUE );
define( 'GD_GF_LICENSE_KEY', 'QFgkyz1mIQ2Pcx652lbTovxhvBHeq6tK' );

// Newrelic tracking
if ( function_exists( 'newrelic_set_appname' ) ) {
	newrelic_set_appname( '226e85fd-e271-46f2-841f-86fe62886bf0;' . ini_get( 'newrelic.appname' ) );
}

/**
 * Is this is a mobile client?  Can be used by batcache.
 * @return array
 */
function is_mobile_user_agent() {
	return array(
	       "mobile_browser"             => !in_array( $_SERVER['HTTP_X_UA_DEVICE'], array( 'bot', 'pc' ) ),
	       "mobile_browser_tablet"      => false !== strpos( $_SERVER['HTTP_X_UA_DEVICE'], 'tablet-' ),
	       "mobile_browser_smartphones" => in_array( $_SERVER['HTTP_X_UA_DEVICE'], array( 'mobile-iphone', 'mobile-smartphone', 'mobile-firefoxos', 'mobile-generic' ) ),
	       "mobile_browser_android"     => false !== strpos( $_SERVER['HTTP_X_UA_DEVICE'], 'android' )
	);
}