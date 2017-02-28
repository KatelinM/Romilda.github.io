// DOCUMENT READY
function _init()
{
	// PRIVACY
	$(".do_privacy").click(function ()
	{
		if ($(".privacy_txt").css("display") == 'none')
		{
			$(".privacy_txt").slideDown();
		}
		else
		{
			$(".privacy_txt").slideUp();
		}
	});



	// PRODUCTS
	$(".d620 a").mouseenter(function ()
	{
		var id = $(this).attr("data-id");

		$(".nav li a").removeClass("active");
		$("#l" + id).addClass("active");

		$(this).children('div').removeClass('hide');
	}).mouseleave(function ()
	{
		$(this).children('div').addClass('hide');
		$(".nav li a").removeClass("active");
	});

	$(".nav li a").mouseenter(function ()
	{
		var id = $(this).attr("data-id");
		$(".d620 a").children('div').addClass('hide');
		$("#p" + id).children('div').removeClass('hide');
	}).mouseleave(function ()
	{
		$(".d620 a").children('div').addClass('hide');
	});

	$("a.prod_item").colorbox({rel:'prods', innerWidth:'570px', innerHeight: '610px'});


	// iframe moodboards
	$("a.if_moodapp").colorbox({iframe: true, innerWidth: "1050px", innerHeight: "780px"});
	$("a.if_3d").colorbox({iframe: true, innerWidth: "992px", innerHeight: "552px"});

	$("a.iframe_cat").colorbox({iframe: true, innerWidth: "1050px", innerHeight: "780px"});
	$("a.iframe_contact").colorbox({iframe: true, innerWidth: "780px", innerHeight: "580px"});
	$("a.iframe_termini").colorbox({iframe: true, innerWidth: "550px", innerHeight: "300px"});
	$("a.privacy_ajax").colorbox({ajax: true, innerWidth: "70%"});


	// FORM
	sendFormShort();

    // Form Landing Page
    sendFormDem();

	// select personalizzato
	$(".styled_store").customSelect();

	// search
	easySearch();

    $("#show_msg_cookie").click(function ()
    {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "ajax/do",
            data: {operation:'set_cookie'},
            success: function(data)
            {
                $(".cookie").css("visibility", "hidden");
            }
        });
    });
}


	// MAPPA DEALER LOCATOR
	var markers = [];
	//var icon1 = "./img/b/flag_natuzzi.png";
	//var icon2 = "./img/b/flag_natuzzi2.png";

    var icon_divani = 'img/b/flag_divaniedivani-on.png';
    var icon_divani_h = 'img/b/flag_divaniedivani-off.png';
    var icon_store = 'img/b/flag_natuzzi-off.png';
    var icon_store_h = 'img/b/flag_natuzzi-on.png';
    var icon_gallery = 'img/b/flag_natuzzi-gallery-off.png';
    var icon_gallery_h = 'img/b/flag_natuzzi-gallery-on.png';
    var icon_essence = 'img/b/flag_natuzzi-essence-off.png';
    var icon_essence_h = 'img/b/flag_natuzzi-essence-on.png';
    var icon_revive = 'img/b/flag_natuzzi-revive-off.png';
    var icon_revive_h = 'img/b/flag_natuzzi-revive-on.png';

	var map;
	var bounds;

	function mappa()
	{
		var myOptions = {
			maxZoom: 16,
			panControl: false,
			scaleControl: false,
            scrollwheel: false,
			zoomControlOptions: {
    			style: google.maps.ZoomControlStyle.SMALL
  			},
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		if (!places.length)
		{
			var latlng = new google.maps.LatLng(coords[0], coords[1]);
			myOptions.zoom = 6;
			myOptions.center = latlng;
		}

		// mappa
		map = new google.maps.Map($("#map")[0], myOptions);

		map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('legend'));

		// usato per auto center e auto zoom
		bounds  = new google.maps.LatLngBounds();

		// marker
		for (var i = 0; i < places.length; i ++)
		{
			addMarker(places[i], map);
		}

		// usato per auto center e auto zoom
		if (places.length > 0)
		{
			map.fitBounds(bounds);
			map.panToBounds(bounds);
		}

	}


	var controls;
	function mappa_open()
	{
		map = new OpenLayers.Map('map', {
	   	   projection: new OpenLayers.Projection('EPSG:900913')
		});

	   map.addLayer(new OpenLayers.Layer.OSM());

	   epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
	   projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)

	   var vectorLayer = new OpenLayers.Layer.Vector("Overlay");

	   for (var i = 0; i < places.length; i ++)
		{

			var description = '<strong>' + places[i]['title'] + '</strong><br />' + places[i]['description'] + '<br /><a href="' + site_url + places[i]['url_rewrite_web'] + '" class="store_button" style="margin-left: 0px;">' + json_lab.L_LOCATOR_DETAIL + '</a>';

			var feature = new OpenLayers.Feature.Vector(
	      	new OpenLayers.Geometry.Point(places[i]['geoloc_lon'],places[i]['geoloc_lat']).transform(epsg4326, projectTo),
	         	{description:description} ,
	            {externalGraphic: 'img/b/flag_natuzzi.png', graphicHeight: 50, graphicWidth: 33}
	        );
	   	   vectorLayer.addFeatures(feature);
		}

		map.addLayer(vectorLayer);

	   if (!places.length)
		{
			lonLat = new OpenLayers.LonLat(coords[1],coords[0]).transform(epsg4326, projectTo);
			zoom = 4;
    		map.setCenter (lonLat, zoom);
		}
		else
		{
			lonLat = new OpenLayers.LonLat(coords[1],coords[0]).transform(epsg4326, projectTo);
			zoom = 4;
    		map.setCenter (lonLat, zoom);
		}

		controls = {
            selector: new OpenLayers.Control.SelectFeature(vectorLayer, { onSelect: createPopup, onUnselect: destroyPopup })
    	};

    	map.addControl(controls['selector']);
    	controls['selector'].activate();
	}



	function createPopup(feature)
	{
		feature.popup = new OpenLayers.Popup.FramedCloud("pop",
	   feature.geometry.getBounds().getCenterLonLat(),
	   	null,
	      '<div class="markerContent">'+feature.attributes.description+'</div>',
	     //'<div style="font-size:12px; oveflow:hidden !important"><strong>' + feature['title'] + '</strong><br />' + feature['description'] + '<br /><a href="' + site_url + feature['url_rewrite_web'] + '" class="store_button" style="margin-left: 0px;">' + json_lab.L_LOCATOR_DETAIL + '</a></div>',
	      null,
	      true,
	      function() { controls['selector'].unselectAll(); }
	   );
	   //feature.popup.closeOnMove = true;
	   map.addPopup(feature.popup);
	}

	function destroyPopup(feature)
	{
		feature.popup.destroy();
	   feature.popup = null;
	}

	var num_iw = 0;
	var iws = new Array();

    var icon_std;
	function addMarker(point, map)
	{
        switch(point.type) {
            case 'Natuzzi Store':
                icon_std = icon_store;
                icon_hover = icon_store_h;
                break;

            case 'Natuzzi Gallery':
                icon_std = icon_gallery;
                icon_hover = icon_gallery_h;
                break;

            case 'Point Essence':
                icon_std = icon_essence;
                icon_hover = icon_essence_h;
                break;

            case 'Natuzzi Re-vive':
                icon_std = icon_revive;
                icon_hover = icon_revive_h;
                break;

            case 'Divani e Divani':
                icon_std = icon_divani;
                icon_hover = icon_divani_h;
                break;
        }



		var latlng = new google.maps.LatLng(point['geoloc_lat'], point['geoloc_lon']);
		markers[point['id_store']] = new google.maps.Marker({
			map: map,
			position: latlng,
			icon: icon_std
		});

		var iw = new google.maps.InfoWindow({
			content: '<div style="width: 200px; height: 120px; font-size:12px; oveflow:hidden !important"><strong>' + point['title'] + '</strong><br />' + point['description'] + '<br /><a href="' + site_url + point['url_rewrite_web'] + '" class="store_button" style="margin-left: 0px;">' + json_lab.L_LOCATOR_DETAIL + '</a></div>'
		});

		iws[num_iw++] = iw;

		if(!(point['geoloc_pov_heading'] == -1 && point['geoloc_pitch'] == -1))
		{
			$('#action_pv_' + point['id_store']).append('<a href="javascript:void(0);" class="sv">' + json_lab.L_LOCATOR_STREET_VIEW + '</a>');
		}

		if (point['email'] != "")
		{
			$('#action_pv_' + point['id_store']).append('<a href="mailto:' + point['email'] + '" class="cs">' + json_lab.L_LOCATOR_CONTACT_STORE + '</a>');
		}

		if (point['web'] != "")
		{
			$('#action_pv_' + point['id_store']).append('<a href="http://' + point['web'] + '" target="_blank" class="cs">' + json_lab.L_LOCATOR_WEB_SITE + '</a>');
		}

		$('#action_pv_' + point['id_store']).append('<a href="' + site_url + point['url_rewrite_web'] + '" class="cs">' + json_lab.L_LOCATOR_DETAIL + '</a>');


		$('#action_pv_' + point['id_store'] + " .sv").click(function ()
		{
			openStreetView(point);
		});

		$('#point_' + point['id_store']).mouseover(function ()
		{
			markers[point['id_store']].setIcon(icon_hover);
		}).mouseout(function ()
		{
			markers[point['id_store']].setIcon(icon_std);
		});

		google.maps.event.addListener(markers[point['id_store']], 'mouseover', function() {

            switch(point.type) {
                case 'Natuzzi Store':
                    icon_std = icon_store;
                    icon_hover = icon_store_h;
                    break;

                case 'Natuzzi Gallery':
                    icon_std = icon_gallery;
                    icon_hover = icon_gallery_h;
                    break;

                case 'Point Essence':
                    icon_std = icon_essence;
                    icon_hover = icon_essence_h;
                    break;

                case 'Natuzzi Re-vive':
                    icon_std = icon_revive;
                    icon_hover = icon_revive_h;
                    break;

                case 'Divani e Divani':
                    icon_std = icon_divani;
                    icon_hover = icon_divani_h;
                    break;
            }

			markers[point['id_store']].setIcon(icon_hover);
		});
		google.maps.event.addListener(markers[point['id_store']], 'mouseout', function() {

            switch(point.type) {
                case 'Natuzzi Store':
                    icon_std = icon_store;
                    icon_hover = icon_store_h;
                    break;

                case 'Natuzzi Gallery':
                    icon_std = icon_gallery;
                    icon_hover = icon_gallery_h;
                    break;

                case 'Point Essence':
                    icon_std = icon_essence;
                    icon_hover = icon_essence_h;
                    break;

                case 'Natuzzi Re-vive':
                    icon_std = icon_revive;
                    icon_hover = icon_revive_h;
                    break;

                case 'Divani e Divani':
                    icon_std = icon_divani;
                    icon_hover = icon_divani_h;
                    break;
            }

			markers[point['id_store']].setIcon(icon_std);
		});

		// associo all'evento click sul markers[point['id_store']], l'apertura del tooltip
		google.maps.event.addListener(markers[point['id_store']], 'click', function()
		{
			//infowindow.open(map, markers[point['id_store']]);
			for(var i = 0; i < num_iw; i++)
				iws[i].close();

			iw.open(map, this);
		});

		// usato per auto center e auto zoom
		bounds.extend(latlng);
	}

	function openStreetView(point)
	{
		// genera mappa street view e apri il div
		var pos = new google.maps.LatLng(point['geoloc_lat'], point['geoloc_lon']);
		var panoramaOptions = {
			position: pos,
			pov: {
				heading: parseInt(point['geoloc_pov_heading']),
				pitch: parseInt(point['geoloc_pitch'])
			},
			visible: true
		};
		$("#map2").show(0, function(){
			var panorama = new google.maps.StreetViewPanorama($('#map2').get(0), panoramaOptions);
		});

		$(".closeSteet").click(function ()
		{
			delete(panorama);
			$("#map2").hide();
		});
	}

	function MoveMap()
	{
		var top = $(window).scrollTop();
		if (top > 265)
			$("#map,#map2").stop().animate({'marginTop':top - 300}, 1000, "easeOutExpo");
		else
			$("#map,#map2").stop().animate({'marginTop':0}, 1000, "easeOutExpo");
	}


	$(window).load(function () {posFooter()})
	$(window).resize(function () {posFooter()})

	/*$(window).scroll(function () {
		MoveMap();
	});*/

	function posFooter()
	{
		h_win = $(window).height();
		h_page = $('.top').height() + $('.page_wrap').height()+55 + $('.footer').height()+80;

		if (h_win>h_page) {
			$('.footer').css({'position':'fixed', 'bottom':'0'})
		}else{
			$('.footer').css({'position':'relative', 'bottom':'auto'})
		}
	}


	// FORM

    function criteoStats(data) {

        console.log(data);

        var d = new Date();
        var n = d.getTime();

        window.criteo_q = window.criteo_q || [];
        window.criteo_q.push(
            { event: "setAccount", account: 24307 },
            { event: "setSiteType", type: "d" },
            { event: "setEmail", email: data.email },
            { event: "trackTransaction", id: n, item: [
                { id: data.id_product, price: 1, quantity: 1}
            ]}
        );
    }

    function criteoStatsUk(data) {

        var d = new Date();
        var n = d.getTime();

        window.criteo_q = window.criteo_q || [];
        window.criteo_q.push(
            { event: "setAccount", account: 29556 },
            { event: "setSiteType", type: "d" },
            { event: "setEmail", email: data.email },
            { event: "trackTransaction", id: n, item: [
                { id: data.id_product, price: 1, quantity: 1}
            ]}
        );
    }

    function trackEventGeneral() {

        window._adftrack = {
            pm: 704814,
            divider: encodeURIComponent('|'),
            pagename: encodeURIComponent('Lead')
        };
        (function () { var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://track.adform.net/serving/scripts/trackpoint/async/'; var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); })();

    }

	function sendFormShort()
	{
		$(".do_form_small").click(function ()
		{
            var button = $(this);
            var fform = button.closest('form');
            var response = button.closest('.form_small_response');

            var isStoresSitesForm = false;
            if (response.length === 0){
                isStoresSitesForm = true;
                response = $('.stores-sites-form-response');
            }

			//openLoading("#l_form_small");
			$("#loading_form_small").show();
			button.attr("disabled", true);

			var form_data  = fform.serialize();

			$.ajax({
				type: "POST",
				dataType: "json",
				url: "ajax/do",
				data: {form_data:form_data, operation:'contact_small'},
				success: function(data)
				{
                    $("#loading_form_small").hide();
					button.attr("disabled", false);
					if (data.error == true)
					{
						$.colorbox({innerWidth: "500px", html:"<div class='popup_error'><h2>" + json_lab.L_ERROR_ATTENTION + "</h2>" + data.message + "</div>"});
					}
					else
					{
                        var data2 = [];
                        data2.email = $('.rigaFormRichiesta input[name="email"]').val();
                        data2.id_product = $('input[name="id_product"]').val();

						response.html("<p>" + data.message + "</p>");

                        if (isStoresSitesForm){
                            $('.stores-sites-form').hide();
                            $('.stores-sites-form-response').show();
                        }

						trackPageView(data.track_event);
						trackGoalForm('thankyou.html');

                        if (lang === 'es-ES') {
                            // call criteo function
                            trackEventGeneral();
                            criteoStats(data2);
                        }

                        if (lang === 'en-UK') {
                            criteoStatsUk(data2);
                        }
					}
				}
			});
		});
	}

    function sendFormDem()
    {
        $(".do_form_small_dem").click(function ()
        {
            openLoading("#l_form_small");
            $(".do_form_small_dem").attr("disabled", true);

            var form_data  = $(".form_small_dem").serialize();

            $.ajax({
                type: "POST",
                dataType: "json",
                url: "ajax/do",
                data: {form_data:form_data, operation:'contact_small_dem'},
                success: function(data)
                {
                    closeLoading("#l_form_small");
                    $(".do_form_small_dem").attr("disabled", false);

                    if (data.error == true)
                    {
                        $.colorbox({innerWidth: "500px", html:"<div class='popup_error'><h2>" + json_lab.L_ERROR_ATTENTION + "</h2>" + data.message + "</div>"});
                    }
                    else
                    {
                        var data2 = [];
                        data2.email = $('.rigaFormRichiesta input[name="email"]').val();
                        data2.id_product = $('input[name="id_product"]').val();

                        $(".form_small_response").html("<p>" + data.message + "</p>");
                        trackPageView(data.track_event);
                        trackGoalForm('thankyou-dem.html');

                        if (lang === 'es-ES') {
                            // call criteo function
                            criteoStats(data2);
                        }

                        if (lang === 'en-UK') {
                            criteoStatsUk(data2);
                        }
                    }
                }
            });
        });
    }


    function sendFormLandingPage2()
    {
     $(".do_form_landing2").click(function ()
     {
         openLoading("#l_form_landing2");
         $(".do_form_landing2").attr("disabled", true);


         var button = $(this);
         var fform = button.closest('.form_landing');

         var form_data  = fform.serialize();


         $.ajax({
             type: "POST",
             dataType: "json",
             url: "ajax/do",
             data: {form_data:form_data, operation:'contact_landing_page2'},
             success: function(data)
             {
                 closeLoading("#l_form_landing2");
                 $(".do_form_landing2").attr("disabled", false);

                 if (data.error == true)
                 {
                     $.colorbox({innerWidth: "90%", html:"<div class='popup_error' style=\"padding: 40px; font-size: 100%\"><h2>" + json_lab.L_ERROR_ATTENTION + "</h2>" + data.message + "</div>"});
                 }
                 else
                 {
                     location.href = site_url + "/thankyou-page.html";
                 }
             }
         });
     });
    }


	// analytics
	function trackEvent(section, action, element)
	{
		//_gaq.push(['_trackEvent', section, action, element]);
        ga('send', 'event', section, action, element);
	}

	function trackPageView(page)
	{
		//_gaq.push(['_trackPageview', page]);
        ga('send', 'pageview', page);
	}

	function trackGoalForm(page)
	{
		var iframe = document.createElement('iframe');
		iframe.style.width = '0px';
		iframe.style.height = '0px';
		document.body.appendChild(iframe);
		iframe.src = site_url + '/' + page;
	}


	var key_old = "";
	// ricerca
	function easySearch()
	{
		$("#input_search").keyup(function (key)
		{
			var timer = setTimeout(function (timer)
			{
				var key_search = $("#input_search").val();

				if (key_search != '' && key_search != key_old && key_search.length > 2)
				{
					$.ajax({
						type: "POST",
						dataType: "json",
						url: "ajax/do",
						data: {key_search: key_search, operation:'search'},
						success: function(data)
						{
							if (!data.error)
							{
								$(".result_search .search_with_img ul").html('');
								$.each(data.data, function (key, value)
								{
									$(".result_search .search_with_img ul").append('<li class="clearfix"><a href="' + value.url_rewrite + '" class="clearfix"><img src="' + value.img.path + '" alt="' + value.img.alt + '" height="70" style="float: left; margin-right: 15px;" /><strong>' + value.title + '</strong><br /><span>' + value.abstract + '</span></a></li>');
								});
							}
							else
							{
								$(".result_search .search_with_img ul").html('<li class="clearfix no_results_search">' + data.message + '</li>');
							}
							$(".result_search").show();

							key_old = key_search;
						}
					});
				}
				else
				{
					$(".result_search .search_with_img ul").html('');
					$(".result_search").hide();
				}
				clearTimeout(timer);

			}, 100);
		});
	}

    var fixOnScroll = function () {
        var pos_title = $(".text_slide_product").offset();
        var pos_form = $(".modRichiesta_Prodotto").offset();
        var pos_window = $(window).scrollTop();

        $(window).on("scroll", function () {
            pos_window = pos_window = $(window).scrollTop();

            if (pos_window >= pos_title.top) {
                $(".text_slide_product").css({position: "fixed", top: 0});
                $(".modRichiesta_Prodotto").css({position: "fixed", top: "100px", left: pos_form.left});
                $(".tit_txt").slideUp();
                TweenMax.to($('.text_slide_product'), 1, {backgroundColor: "rgba(204, 202, 201, 0.9)", ease:Expo.easeOut});
            } else {
                $(".text_slide_product").css({position: "absolute", top: 'auto', bottom: 0});
                $(".modRichiesta_Prodotto").css({position: "relative", top:'auto', left: 'auto'});
                $(".tit_txt").slideDown();
                TweenMax.to($('.text_slide_product'), 1, {backgroundColor: "rgba(229, 225, 222, 0.9)", ease:Expo.easeOut});
            }
        });
    };

    var fixTitleOnScroll = function () {
        var pos_title = $(".text_slide_product").offset();
        var pos_window = $(window).scrollTop();

        $(window).on("scroll", function () {
            pos_window = pos_window = $(window).scrollTop();

            if (pos_window >= pos_title.top) {
                $(".text_slide_product").css({position: "fixed", top: 0});
                TweenMax.to($('.text_slide_product'), 1, {backgroundColor: "rgba(204, 202, 201, 0.9)", ease:Expo.easeOut});
                $(".prod_down_slide").fadeOut();
            } else {
                $(".text_slide_product").css({position: "absolute", top: 'auto', bottom: 0});
                TweenMax.to($('.text_slide_product'), 1, {backgroundColor: "rgba(229, 225, 222, 0.9)", ease:Expo.easeOut});
            }
        });
    };


    var isMobile = function () {
        if ($(".isMobile").css("display") == 'block') {
            return true;
        }

        return false;
    }



/* cookie */
function setCookiePolicy() {
    var nameCookie = 'wasa_cookies_policy';
    var valueCookie = 'ok';
    var expireCookie = 365; // days
    var deadline = new Date();
    var now = new Date();
    deadline.setTime(now.getTime() + (expireCookie * 24 * 60 * 60 * 1000));
    document.cookie = nameCookie + '=' + escape(valueCookie) + '; expires=' + deadline.toGMTString() + '; path=/';
    $(".wasa_cookies").hide();
}

function getCookiePolicy() {
    var name = "wasa_cookies_policy=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            if (c.substring(name.length,c.length) == 'ok') {
                $(".wasa_cookies").hide();
            }
        }
    }
    return "";
}


$(document).ready(function () {
    // calcola dimensione finestra
    $('.arrow-scroll').on({
        click: init_scroll
    });
});

function rotateToUp() {
    TweenLite.to($('.arrow-scroll'), 0.3, {rotation:180, transformOrigin:"center center"});
    $('.arrow-scroll').addClass("goUp");

    $(".arrow-scroll").unbind('click');
     $('.goUp').on({
        click: function () {
             TweenLite.to($('html,body'), 1.2, {scrollTop: 0, ease:Quint.easeOut, onComplete: function () {
                $(".goUp").unbind('click');
                $('.arrow-scroll').removeClass("goUp");
                $('.arrow-scroll').on({
                    click: init_scroll
                });
             }});
        }

    });
}

function rotateToDown() {
    TweenLite.to($('.arrow-scroll'), 0.3, {rotation:0, transformOrigin:"center center"});
    $('.arrow-scroll').removeClass("goUp");
}

$(window).on({
    scroll: function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            rotateToUp();
        } else {
            rotateToDown();
        }
    }
});

function init_scroll () {
    var y = $(window).scrollTop() - 87;
    var scroll = y + $(window).height();

    TweenLite.to($('html,body'), 1.2, {scrollTop: scroll, ease:Quint.easeOut, onComplete: function () {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            // cambia verso freccia
            rotateToUp();
        }
    }});
}


// newsletter
function closeNewsletter() {
    $(".popup_newsletter").fadeOut();
}

function openNewsletter() {
    //if (readCookie('nl_subsribe') != 'ok' && readCookie('nl_count') < 3) {
        $(".popup_newsletter").show();

        //var num = readCookie('nl_count');

        //num ++;
        //writeCookie("nl_count", num, 6000);
    //}
}

function sendSubNewletter() {
    $(".btn_nl_send").attr("disabled", true);

    var form_data  = $(".form_newsletter").serialize();

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "ajax/do",
        data: {form_data:form_data, operation:'newlsetter_sub'},
        success: function(data)
        {
            $(".btn_nl_send").attr("disabled", false);

            if (data.error == true)
            {
                $.colorbox({innerWidth: "500px", html:"<div class='popup_error'><h2>" + json_lab.L_ERROR_ATTENTION + "</h2>" + data.message + "</div>"});
            }
            else
            {
                $(".newsletter_response").html("<p>" + data.message + "</p>");
                writeCookie("nl_subsribe", 'ok', 6000);
            }
        }
    });
}
