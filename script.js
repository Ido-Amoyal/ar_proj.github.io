 // Start AR on button click
 document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('start-button').style.display = 'none'; // Hide the start button
    document.getElementById('ar-scene').style.display = 'block'; // Show the AR scene
});

// Include the JavaScript code for accordion and scroll behavior here
$(document).ready(function () {
    let duration_in_sec = 0.5;
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Set all accordion items to closed except the one that is already open
    $(".accordion__item").not(".open").find(".accordion__item--wrap").css("height", 0);

    // Handle accordion title clicks
    $(".accordion__item--title").on("click", function () {
        var parent = $(this).closest(".accordion__item");
        var contentWrap = parent.find(".accordion__item--wrap");

        if (parent.hasClass("open")) {
            // Close the current accordion with animation
            gsap.to(contentWrap, { height: 0, duration: duration_in_sec });
            parent.removeClass("open");
        } else {
            // Close all other accordions
            $(".accordion__item.open").each(function () {
                var openItemWrap = $(this).find(".accordion__item--wrap");
                gsap.to(openItemWrap, { height: 0, duration: duration_in_sec });
                $(this).removeClass("open");
            });

            // Open the clicked accordion
            var contentHeight = parent.find(".accordion_body_content").outerHeight();
            gsap.to(contentWrap, { height: contentHeight, duration: duration_in_sec });
            parent.addClass('open');

            // Scroll to the opened accordion
            setTimeout(() => {
                let headerHeight = $(".header").innerHeight() * 1.8;
                let targetOffset = parent.offset().top - headerHeight;
                if (window.innerWidth < 1024) {
                    targetOffset = targetOffset - (headerHeight / 2);
                }
                $('html, body').animate({
                    scrollTop: targetOffset
                }, 500);
            }, 500);
        }
    });

    // Handle scroll-triggered animations using GSAP
    gsap.utils.toArray(".accordion__item").forEach(function (item, index, items) {
        ScrollTrigger.create({
            trigger: item,
            start: 'top top+=100',  // Trigger when top of item reaches top of viewport + 100px
            end: 'bottom bottom',   // End when bottom of item reaches bottom of viewport
            toggleActions: "play none none none",
            markers: true, // Remove in production
            onEnter: function (self) {
                console.log("Entering:", item);

                // Close all other accordions when scrolling into a new one
                $(".accordion__item.open").not(item).each(function () {
                    var openItemWrap = $(this).find(".accordion__item--wrap");
                    gsap.to(openItemWrap, { height: 0, duration: duration_in_sec });
                    $(this).removeClass("open active");
                });

                // Open the current accordion item
                var contentHeight = $(item).find(".accordion_body_content").outerHeight();
                gsap.to($(item).find(".accordion__item--wrap"), { height: contentHeight, duration: duration_in_sec });
                $(item).addClass("open");

                // Prevent auto-scroll to the next item until a full viewport scroll has occurred
                ScrollTrigger.refresh();
            },
            onLeaveBack: function (self) {
                console.log("Leaving upward:", item);

                // Close the current accordion when scrolling up past it
                var contentWrap = $(item).find(".accordion__item--wrap");
                gsap.to(contentWrap, { height: 0, duration: duration_in_sec });
                $(item).removeClass("open active");

                // Close all other accordions to prevent multiple from being open
                $(".accordion__item").not(item).each(function () {
                    var openItemWrap = $(this).find(".accordion__item--wrap");
                    gsap.to(openItemWrap, { height: 0, duration: duration_in_sec });
                    $(this).removeClass("open active");
                });

                // Open the previous accordion item if scrolling up
                if (index > 0) {
                    var prevItem = items[index - 1];
                    var prevContentHeight = $(prevItem).find(".accordion_body_content").outerHeight();
                    gsap.to($(prevItem).find(".accordion__item--wrap"), { height: prevContentHeight, duration: duration_in_sec });
                    $(prevItem).addClass("open");

                    ScrollTrigger.refresh();
                }
            },
            onLeave: function (self) {
                console.log("Leaving downward:", item);

                // Close the current accordion when scrolling down past it
                var contentWrap = $(item).find(".accordion__item--wrap");
                gsap.to(contentWrap, { height: 0, duration: duration_in_sec });
                $(item).removeClass("open active");

                // Automatically open the next accordion item if it exists
                if (index < items.length - 1) {
                    var nextItem = items[index + 1];
                    var nextContentHeight = $(nextItem).find(".accordion_body_content").outerHeight();
                    gsap.to($(nextItem).find(".accordion__item--wrap"), { height: nextContentHeight, duration: duration_in_sec });
                    $(nextItem).addClass("open");

                    ScrollTrigger.refresh();
                }
            }
        });
    });
});