// The following code will be enclosed within an anonymous function
// this avoids any conflicts with the rest of the page's js'
(function() {
    // Localize jQuery variable
    var jQuery;

    /******** Load jQuery if not present *********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '2.0.3') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type","text/javascript");
        script_tag.setAttribute("src",
            "http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js");
        if (script_tag.readyState) {
          script_tag.onreadystatechange = function () { // For old versions of IE
              if (this.readyState == 'complete' || this.readyState == 'loaded') {
                  scriptLoadHandler();
              }
          };
        } else { // Other browsers
          script_tag.onload = scriptLoadHandler;
        }
        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        main();
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(true);
        // Call our main function
        main(); 
    }

    /******** Our main function ********/
    function main() { 
        jQuery(document).ready(function($) { 
            //include the stylesheet
            $('head').append('<link rel="stylesheet" href="http://what.dogeapi.com/widget/widget.css" type="text/css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />');
            //do each widget
            $(".doge-widget-wrapper").each(function() {
                var dogeWidget = $(this);
                //set variables from form in widget
                var widget_key = $(this).find("input[name=widget_key]").val();
                if(widget_key === undefined) widget_key = '';
                
                var payment_address = $(this).find("input[name=payment_address]").val();
                if(payment_address === undefined) payment_address = 'error getting payment address';
                
                var widget_type = $(this).find("input[name=widget_type]").val();
                if(widget_type === undefined) widget_type = 'pay';

                var address_label = $(this).find("input[name=address_label]").val();
                if(address_label === undefined) address_label = '';
                
                var new_address = $(this).find("input[name=new_address]").val();
                if(new_address === undefined) {
                    new_address = false;
                } else {
                    payment_address = 'error getting payment address';
                }
                
                var payment_label = $(this).find("input[name=payment_label]").val();
                
                if(payment_label === undefined) {
                    
                } else {
                    //TODO get the address by label and use it   
                }
                
                var amount_doge = $(this).find("input[name=amount_doge]").val();
                if(amount_doge === undefined) {
                    amount_doge = '';
                } 
                
                var show_received = $(this).find("input[name=show_received]").val();
                
                if(show_received == '1') {
                    show_received = true;
                    if(address_label != '') params = "&payment_address="+address_label;
                    if(payment_address != '') params = "&payment_address="+payment_address;
                    $.ajax({
                      url: "http://what.dogeapi.com/wow/js.php",
                      data: "widget_key="+widget_key+"&a=get_address_received"+params,
                      success: function(data) {
                          if(data != 'Bad Query') {
                              var receivedDiv = dogeWidget.find(".doge-widget-received");
                              receivedDiv.html("<b>"+data+"</b>D");
                              receivedDiv.show();
                              dogeWidget.find(".doge-widget-pay-link").css("top","-6px");
                              dogeWidget.find(".doge-widget-received-label").show();
                          }
                      },
                      dataType: "json",
                      type: "GET"
                    });
                } else {
                    show_received = false;
                }
                
                //load the default widget
                if(widget_type == "pay" || widget_type == "donate") {
                    //set the widget type
                    var sendType = 'pay';
                    var buttonLabel = 'Pay With';
                    if(widget_type == 'donate') sendType = 'donate';
                    if(widget_type == 'donate') buttonLabel = 'Donate';
                    
                    //add the widget html
                    
                    var widgetHtml = "<button class='doge-widget-pay' id='widget-inactive'><div class='doge-widget-text doge-widget-site-link'><img class='doge-widget-logo' src='http://what.dogeapi.com/widget/dogeapi-"+sendType+".png'></div><img width='32' class='doge-widget-icon' src='http://what.dogeapi.com/widget/coin.png'><div class='doge-widget-texts'><div class='doge-widget-text doge-widget-pay-link'>"+buttonLabel+" Doge</div><div class='doge-widget-text doge-widget-received primary'></div><div class='doge-widget-text doge-widget-received-label'>has been donated</div></div></button><div class='doge-widget-payment-address'>Or "+sendType+" <span class='branding primary'>"+amount_doge+"DOGE</span> to <b class='payment-address-color'>"+payment_address+"</b> with your wallet.</b></div><div class='doge-widget-cancel-link'><a href='#'>Cancel</a></div>";
                    $(this).find(".doge-widget").html(widgetHtml);
                    //instead put it in an iframe
                    /* we may do this later but it has several downsides
                    $(this).find(".doge-widget").append("<iframe id='widget-iframe' src='about:blank' style='width:100%;height:50px; border:none;'></iframe>");
                    $('#widget-iframe').contents().find('body').html(widgetHtml);
                    $('#widget-iframe').contents().find('head').html('<link rel="stylesheet" href="http://what.dogeapi.com/widget/widget.css" type="text/css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />');
                    $('.doge-widget').show();
                    dogeWidget = $('#widget-iframe').contents().find('.doge-widget');
                    */
                    
                    //set what happens on click
                    dogeWidget.find(".doge-widget-pay").click(function(e) {
                        //if we have to get a new payment address
                        if(payment_address == 'error getting payment address') {
                            $.ajax({
                              url: "http://what.dogeapi.com/wow/js.php",
                              data: "widget_key="+widget_key+"&a=get_new_address&label="+new_address,
                              success: function(data) {
                                  dogeWidget.find(".payment-address-color").html(data);
                              },
                              dataType: "json",
                              type: "GET"
                            });
                        }
                        
                        //if the button is not already active activate it
                        var activity = $(this).attr("id");
                        
                        if(activity == "widget-inactive") {
                            //prevent the first click from submitting the form
                            e.preventDefault();
                            var paymentDiv = dogeWidget.find(".doge-widget-payment-address");
                            //fade out the text
                            dogeWidget.find(".doge-widget-texts .doge-widget-text").animate({"width" : "0%"},150, function() {
                                //then slide the icon over
                                dogeWidget.find(".doge-widget-icon").animate({"left" : "95px" }, 150, function() {
                                    //fade int he new text
                                    dogeWidget.find(".doge-widget-site-link").animate({"width" : "91px"},50, function() {    
                                    
                                    });
                                    
                                    paymentDiv.animate({"width" : "450px", "opacity":"1","font-size":"12px"},120, function() {    
                                        dogeWidget.find('.doge-widget-pay').attr("id","widget-active");
                                        dogeWidget.find(".doge-widget-cancel-link").animate({"left" : "580px","opacity":"1"},400, function() {    
                                            dogeWidget.find(".doge-widget-cancel-link a").click(function(e) {
                                                //prevent the click from doing anything
                                                e.preventDefault();
                                                //close. 
                                                //EVERYTHING.
                                                dogeWidget.find(".doge-widget-cancel-link").animate({"left" : "0px","opacity":"0"},100, function() { 
                                                    $('.doge-widget-pay').attr("id","widget-inactive");
                                                    paymentDiv.animate({"width" : "0px", "opacity":"0","font-size":"12px"},120, function() {  
                                                        dogeWidget.find(".doge-widget-site-link").animate({"width" : "0"},50, function() {    
                                                            //then slide the icon over
                                                            dogeWidget.find(".doge-widget-icon").animate({"left" : "3px" }, 150, function() {
                                                                dogeWidget.find(".doge-widget-texts .doge-widget-text").animate({"width" : "91px"},150, function() {
                                                                 
                                                                });  
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        }
                        
                        if(activity == "widget-active") {
                            //window.open("http://what.dogeapi.com/checkout",'_blank'); 
                            //now we just let the form go there  
                        }
                    })
                }
                $(this).find(".doge-widget").show();
            }); //end each
        }); //end jquery scope
    }
})(); // We call our anonymous function immediately