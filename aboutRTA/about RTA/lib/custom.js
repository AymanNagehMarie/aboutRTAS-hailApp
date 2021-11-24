var lang,
    page,
    ulang,
    pageData,
    pageTexts,
    endPoint,
    endPointBooking,
    userToken,
    secretKey,
    bookingData,
    processId,
    version,
    userData,
    operator,
    displayFeedbackText,
    rtaId,
    debug = !1;
(bookings = []),
    (bookingsDispatched = []),
    (bookingsPerformed = []),
    (_paq = []),
    (selectedFare = 0),
    (content = document.querySelector(".content")),
    (overlay = document.querySelector(".overlay")),
    (info = document.querySelector(".info")),
    (lang = getParameterByName("lang")),
    (page = getParameterByName("page").toUpperCase()),
    (endPoint = getParameterByName("endPoint")),
    (endPointBooking = getParameterByName("endPointBooking")),
    (userToken = getParameterByName("userToken")),
    (secretKey = getParameterByName("secretKey")),
    (bookingData = getParameterByName("bookingData")),
    (processId = getParameterByName("processId")),
    (version = getParameterByName("version")),
    (userData = getParameterByName("userData")),
    (operator = getParameterByName("operator")),
    (displayFeedbackText = getParameterByName("displayFeedbackText")),
    (rtaId = getParameterByName("rtaId")),
    getParameterByName("debug") && (debug = !0);
var isTaxiBooking = function () {
        if (null == operator || "taxi" == operator) var a = !0;
        else var a = !1;
        return a;
    },
    getOperator = function () {
        return isTaxiBooking() ? "dubaiTaxi" : "dtcLimousine";
    },
    getCloudData = function (a) {
        var b = { dataSafeLookUpReq: { userToken: userToken, dataSafeKey: a.dataSafeKey, authKey: md5(secretKey + "#" + userToken + "#" + a.dataSafeKey) } };
        postJSON({
            url: endPoint + "/cloudAuth?_rnd=" + new Date().getTime(),
            contentType: "application/x-www-form-urlencoded",
            postBody: "cloudInterface=" + encodeURIComponent(JSON.stringify(b)),
            success: function (b) {
                "function" == typeof a.success && a.success(b.dataSafeLookUpResp);
            },
            error: function (b) {
                "function" == typeof a.error && a.error();
            },
        });
    },
    saveCloudData = function (a) {
        var b = { dataSafeDepositReq: { userToken: userToken, dataSafeKey: a.dataSafeKey, dataSafeValue: a.dataSafeValue, authKey: md5(secretKey + "#" + userToken + "#" + a.dataSafeKey) } };
        postJSON({
            url: endPoint + "/cloudAuth?_rnd=" + new Date().getTime(),
            contentType: "application/x-www-form-urlencoded",
            postBody: "cloudInterface=" + encodeURIComponent(JSON.stringify(b)),
            success: function (b) {
                "function" == typeof a.success && a.success(b.dataSafeDepositResp);
            },
            error: function (b) {
                "function" == typeof a.error && a.error();
            },
        });
    },
    updateBookingList = function (a) {
        var b = JSON.parse(JSON.stringify(bookings)),
            c = document.getElementById("bookings"),
            d = function () {
                var a = !0;
                b.forEach(function (b) {
                    "undefined" == typeof b.status && (a = !1);
                }),
                    a && f();
            },
            e = function (a) {
                var c = a.bookingObj,
                    d = document.createElement("div");
                if ("undefined" != typeof c.origin && "undefined" != typeof c.destination) {
                    var e = "",
                        g = "";
                    if ("undefined" != typeof c.status.expectedTime) {
                        e = formatDate(new Date(c.status.expectedTime));
                        var h = new Date(c.status.expectedTime).getHours();
                        h < 10 && (h = "0" + h);
                        var i = new Date(c.status.expectedTime).getMinutes();
                        i < 10 && (i = "0" + i), (g = h + ":" + i);
                    }
                    var j = c.status.status;
                    "undefined" != typeof pageTexts.STATUSTEXTS[c.status.status.toUpperCase().replace(/ /g, "_")] && (j = pageTexts.STATUSTEXTS[c.status.status.toUpperCase().replace(/ /g, "_")]),
                        (d.className = "swipeButtonWrapper"),
                        "undefined" != typeof a.list && d.setAttribute("data-list", a.list),
                        "undefined" != typeof a.idx && d.setAttribute("data-index", a.idx);
                    var k = document.createElement("div");
                    k.className = "swipeButton";
                    var l = document.createElement("div");
                    "ACTIVE" == c.status.stage && (l.className = "activeBooking");
                    var m = '<div class="icon ' + c.type + '"></div>';
                    (m += '<div class="bookingDate">'),
                        (m += "" != e ? e + ", " + g : "&nbsp;"),
                        (m += "</div>"),
                        (m += '<div class="bookingConfirmationId">#' + c.booking.confirmation.confirmationId + "</div>"),
                        (m += '<div class="bookingLocation bookingLocationFrom">' + pageTexts.FROM + ": <span>" + c.origin.address + "</span></div>"),
                        (m += '<div class="bookingLocation">' + pageTexts.TO + ": <span>" + c.destination.address + "</span></div>"),
                        (m += '<div class="bookingLocation bookingStatus">' + pageTexts.STATUS + ": " + j + "</div>"),
                        "ACTIVE" == c.status.stage &&
                            (m += '<a class="bookingMapButton" href="shailapp://bookings/taxi/show?booking=' + encodeURIComponent(JSON.stringify(c.booking)) + "&operator=" + c.type + '">' + pageTexts.SHOWONMAP + "</a>"),
                        (l.innerHTML = m),
                        k.appendChild(l),
                        d.appendChild(k);
                    var n = !0;
                    if (
                        (("JOB_IS_PICKED_UP" !== j &&
                            "JOB_IS_DROPPED_OFF" !== j &&
                            "JOB_CANCELLED" !== j &&
                            "JOB_NO_SHOW" !== j &&
                            "CANCELED" !== j &&
                            "STARTED" !== j &&
                            "STOPPED" !== j &&
                            "ENDED" !== j &&
                            "CANCELING" !== j &&
                            "NEED_CANCEL" !== j) ||
                            (n = !1),
                        n)
                    ) {
                        var o = document.createElement("div");
                        (o.className = "cancelItem"), "PAST" == c.status.stage && (o.className = "removeItem");
                        document.querySelectorAll(".removeItem");
                        o.addEventListener(
                            "click",
                            (function (a) {
                                return function (d) {
                                    var e = "dubaiTaxi";
                                    "limo" == a.type && (e = "dtcLimousine");
                                    var g = { processId: c.booking.processId, operator: e };
                                    rtaId && (g.userToken = rtaId), debug && (g.debug = !0);
                                    var h = "<div><h2>" + ulang.BOOKINGS.CANCEL_REPROMPT + "</h2></div>";
                                    if ("ACTIVE" == a.status.stage || "UNDER_PROCESS" == a.status.stage)
                                        showPopUPMessage(
                                            null,
                                            h,
                                            ulang.BOOKINGS.CANCEL_YES,
                                            function () {
                                                (content.innerHTML = pageTexts.BODY),
                                                    postJSON({ url: endPointBooking + "/taxi/cancel?_rnd=" + new Date().getTime(), postBody: JSON.stringify(g), success: function (a) {}, error: function (a) {} }),
                                                    _paq.push(["trackEvent", "booking-cancel", a.type]),
                                                    removeEntryFromBookingList({ processId: c.booking.processId });
                                                var d = [];
                                                b.forEach(function (a) {
                                                    a.booking.processId != c.booking.processId && d.push(a);
                                                }),
                                                    (b = d),
                                                    f();
                                            },
                                            ulang.BOOKINGS.CANCEL_NO,
                                            function () {}
                                        );
                                    else {
                                        removeEntryFromBookingList({ processId: c.booking.processId });
                                        var i = [];
                                        b.forEach(function (a) {
                                            a.booking.processId != c.booking.processId && i.push(a);
                                        }),
                                            (b = i),
                                            f();
                                    }
                                };
                            })(c)
                        ),
                            d.appendChild(o);
                    }
                    try {
                        var p = c.status.status.toUpperCase().replace(/ /g, "_");
                        if ("JOB_DISPATCHED" == p) {
                            for (var q = !1, r = 0; r < bookingsDispatched.length; r++)
                                if (bookingsDispatched[r] == c.booking.processId) {
                                    q = !0;
                                    break;
                                }
                            if (!q) {
                                bookingsDispatched.push(c.booking.processId), bookingsDispatched.length > 100 && bookingsDispatched.splice(0, 80);
                                var s = { bookings: bookingsDispatched };
                                saveCloudData({ dataSafeKey: "bookingsDispatched", dataSafeValue: JSON.stringify(s), success: function (a) {}, error: function () {} }), _paq.push(["trackEvent", "dispatched-" + c.type, c.type]);
                            }
                        }
                        if ("JOB_IS_DROPPED_OFF" == p || "ENDED" == p) {
                            for (var q = !1, r = 0; r < bookingsPerformed.length; r++)
                                if (bookingsPerformed[r] == c.booking.processId) {
                                    q = !0;
                                    break;
                                }
                            if (!q) {
                                bookingsPerformed.push(c.booking.processId), bookingsPerformed.length > 100 && bookingsPerformed.splice(0, 80);
                                var t = { bookings: bookingsPerformed };
                                saveCloudData({ dataSafeKey: "bookingsPerformed", dataSafeValue: JSON.stringify(t), success: function (a) {}, error: function () {} }), _paq.push(["trackEvent", "successful-" + c.type, c.type]);
                            }
                        }
                    } catch (u) {}
                }
                return d;
            },
            f = function () {
                var a = document.createElement("div");
                c.innerHTML = "";
                var d = [],
                    f = [],
                    g = [],
                    h = [];
                b.forEach(function (a) {
                    "UNDER_PROCESS" == a.status.stage ? d.push(a) : "ACTIVE" == a.status.stage ? f.push(a) : "PAST" == a.status.stage ? g.push(a) : "ERROR404" == a.status.status && h.push(a);
                });
                var i = document.createElement("div"),
                    j = document.createElement("h1");
                (j.innerHTML = pageTexts.UNDERPROCESSBOOKINGS), (j.className = "groupHeader");
                var k = document.createElement("div");
                (k.className = "groupWrapper"),
                    0 == d.length
                        ? (k.innerHTML = '<div class="noBookingsMessage">' + pageTexts.NOBOOKINGS + "</div>")
                        : d.forEach(function (a) {
                              var b = e({ bookingObj: a });
                              k.appendChild(b);
                          }),
                    i.appendChild(j),
                    i.appendChild(k),
                    a.appendChild(i);
                var l = document.createElement("div"),
                    m = document.createElement("h1");
                (m.innerHTML = pageTexts.FUTUREBOOKINGS), (m.className = "groupHeader");
                var n = document.createElement("div");
                (n.className = "groupWrapper"),
                    0 == f.length
                        ? (n.innerHTML = '<div class="noBookingsMessage">' + pageTexts.NOBOOKINGS + "</div>")
                        : f.forEach(function (a) {
                              var b = e({ bookingObj: a });
                              n.appendChild(b);
                          }),
                    l.appendChild(m),
                    l.appendChild(n),
                    a.appendChild(l);
                var o = 10,
                    p = document.createElement("div"),
                    q = document.createElement("h1");
                (q.className = "groupHeader"), (q.innerHTML = pageTexts.PASTBOOKINGS);
                var r = document.createElement("div");
                if (((r.className = "groupWrapper"), 0 == g.length)) r.innerHTML = '<div class="noBookingsMessage">' + pageTexts.NOBOOKINGS + "</div>";
                else if (
                    (g.forEach(function (a, b) {
                        var c = e({ bookingObj: a, list: "past", idx: b });
                        r.appendChild(c), b >= o && (c.style.display = "none");
                    }),
                    g.length > o)
                ) {
                    var s = document.createElement("div");
                    s.className = "swipeButtonWrapper showMoreButtonWrapper";
                    var t = document.createElement("button");
                    (t.type = "button"), (t.innerHTML = pageTexts.SHOWMORE);
                    var u = o - 1;
                    t.addEventListener("click", function (a) {
                        u += o;
                        for (var b = document.querySelectorAll('[data-list="past"]'), c = 0; c <= u; c++) b[c] && (b[c].style.display = "");
                        u >= g.length - 1 && (s.style.display = "none");
                    }),
                        s.appendChild(t),
                        r.appendChild(s);
                }
                p.appendChild(q), p.appendChild(r), a.appendChild(p), c.appendChild(a), h.length > 0 && removeEntrysFromBookingList(h);
            };
        if (0 == b.length) f();
        else {
            var g = 0;
            b.forEach(function (a) {
                if ("taxi" == a.type || "limo" == a.type) {
                    var b = { processId: a.booking.processId, operator: "dubaiTaxi" };
                    "limo" == a.type && (b.operator = "dtcLimousine"),
                        debug && (b.debug = !0),
                        postJSON({
                            url: endPointBooking + "/taxi/status?_rnd=" + new Date().getTime(),
                            postBody: JSON.stringify(b),
                            success: function (b) {
                                try {
                                    a.status = b.response.statuses[0];
                                } catch (c) {
                                    a.status = { status: "ERROR" };
                                }
                                d();
                            },
                            error: function (b) {
                                (a.status = { status: "ERROR" }), "undefined" != typeof b.status && 404 == b.status && (a.status = { status: "ERROR404" }), d();
                            },
                        });
                }
                g++;
            });
        }
    },
    removeEntryFromBookingList = function (a) {
        getCloudData({
            dataSafeKey: "bookings",
            success: function (b) {
                var c = { bookings: [] };
                if ("undefined" != typeof b.dataSafeValue) {
                    var d = JSON.parse(b.dataSafeValue);
                    "undefined" != typeof d.bookings &&
                        d.bookings.length > 0 &&
                        (d.bookings.forEach(function (b) {
                            b.booking.processId != a.processId && c.bookings.push(b);
                        }),
                        saveCloudData({
                            dataSafeKey: "bookings",
                            dataSafeValue: JSON.stringify(c),
                            success: function (a) {
                                window.location.href = "";
                            },
                            error: function () {
                                window.location.href = "";
                            },
                        }));
                }
            },
        });
    },
    removeEntrysFromBookingList = function (a) {
        getCloudData({
            dataSafeKey: "bookings",
            success: function (b) {
                var c = { bookings: [] };
                if ("undefined" != typeof b.dataSafeValue) {
                    var d = JSON.parse(b.dataSafeValue);
                    "undefined" != typeof d.bookings &&
                        d.bookings.length > 0 &&
                        (d.bookings.forEach(function (b) {
                            var d = !1;
                            a.forEach(function (a) {
                                b.booking.processId == a.booking.processId && ("undefined" != typeof b.time ? new Date().getTime() > new Date(b.time).getTime() + 864e5 && (d = !0) : (d = !0));
                            }),
                                d || c.bookings.push(b);
                        }),
                        saveCloudData({ dataSafeKey: "bookings", dataSafeValue: JSON.stringify(c), success: function (a) {}, error: function () {} }));
                }
            },
        });
    },
    formatCurrency = function (a) {
        var b = Math.floor(a.value / 100),
            c = a.value % 100;
        if (0 == c)
            if ("ar" == lang) var d = b + " " + pageTexts.CURRENCY;
            else var d = pageTexts.CURRENCY + " " + b;
        else if ((c < 10 && (c = "0" + c), "ar" == lang)) var d = b + "." + c + " " + pageTexts.CURRENCY;
        else var d = pageTexts.CURRENCY + " " + b + "." + c;
        return d;
    },
    formatDate = function (a) {
        function b(a) {
            return a < 10 ? "0" + a : a;
        }
        return [b(a.getDate()), b(a.getMonth() + 1), a.getFullYear()].join("/");
    };
(document.querySelector("body").className += lang + "-font"),
    loadJSON("GET", "test_" + lang + ".json", function (a) {
        if (((ulang = a), (pageData = a[page]), "FEEDBACK" == page)) {
            pageTexts = a;
            var b = document.createElement("form");
            (content.id = "feedbackPage"), (content.innerHTML = "<div class='initialBookingLoader bookingLoader'>");
            var c = createFormlElm(a.FORM.MOBILE, "input", "tel", "mobile"),
                d = document.createElement("input");
            (d.type = "hidden"), (d.id = "firstName"), (d.name = "firstName");
            var e = document.createElement("input");
            (e.type = "hidden"), (e.id = "lastName"), (e.name = "lastName");
            for (
                var f = createFormlElm(a.FORM.EMAIL, "input", "email", "email"),
                    g = createFormlElm(a.FORM.CATEGORY, "select", "", "mySelect"),
                    h = createFormlElm(a.FORM.COMMENT, "textarea", "", "message"),
                    i = createFormlBtn("send", a.FORM.SENDBTN),
                    j = document.querySelector(".initialBookingLoader"),
                    k = 0;
                k < a.OPTIONS.length;
                k++
            ) {
                var l = a.OPTIONS[k],
                    m = document.createElement("option");
                (m.value = a.OPTIONVALUES[k]), (m.text = l), g.elm.appendChild(m);
            }
            b.appendChild(c.container), b.appendChild(d), b.appendChild(e), b.appendChild(f.container), b.appendChild(g.container), b.appendChild(h.container), b.appendChild(i);
            var j = document.querySelector(".initialBookingLoader"),
                n = document.createElement("div");
            n.classList.add("note"), (n.innerText = a.FORM.NOTE), (g.elm.className = lang + "-select ");
            var o = document.createElement("div");
            (o.className = "availChars"),
                (o.innerHTML = '<span id="counter"> 500 </span>' + a.GLOBAL.LEFT_CHARS),
                h.container.appendChild(o),
                h.elm.setAttribute("maxlength", "500"),
                content.appendChild(b),
                content.insertBefore(n, content.firstChild),
                maxLength(h.elm),
                b.addEventListener("submit", function (a) {
                    a.preventDefault();
                    var b = !0;
                    if (
                        ((document.getElementById("mobile").className = ""),
                        0 == document.getElementById("mobile").value.trim().length && ((document.getElementById("mobile").className = "required"), (b = !1)),
                        (document.getElementById("email").className = ""),
                        0 == document.getElementById("email").value.trim().length && ((document.getElementById("email").className = "required"), (b = !1)),
                        (document.getElementById("message").className = ""),
                        0 == document.getElementById("message").value.trim().length && ((document.getElementById("message").className = "required"), (b = !1)),
                        b)
                    ) {
                        var c = {
                            caseType: document.getElementById("mySelect").value,
                            firstName: document.getElementById("firstName").value,
                            lastName: document.getElementById("lastName").value,
                            mobileNumber: document.getElementById("mobile").value,
                            email: document.getElementById("email").value,
                            description: document.getElementById("message").value,
                        };
                        debug && (c.debug = !0),
                            postJSON({
                                url: endPointBooking + "/crm/create_case?_rnd=" + new Date().getTime(),
                                postBody: JSON.stringify(c),
                                success: function (a) {
                                    (info.innerHTML =
                                        '<div class="loaderMessage">' +
                                        pageTexts.FORM.SUBMITSUCCESS +
                                        '</div><div class="loaderMessage">#' +
                                        a.ticketNumber +
                                        '</div><div class="loaderButtonWrapper"><button type="button">' +
                                        pageTexts.FORM.OK +
                                        "</button></div>"),
                                        document.querySelector(".loaderButtonWrapper button").addEventListener("click", function (a) {
                                            (overlay.style.display = "none"), (info.style.display = "none"), (document.getElementById("message").value = "");
                                        });
                                },
                                error: function () {
                                    (info.innerHTML = '<div class="loaderMessage">' + pageTexts.FORM.SUBMITFAIL + '</div><div class="loaderButtonWrapper"><button type="button">' + pageTexts.FORM.OK + "</button></div>"),
                                        document.querySelector(".loaderButtonWrapper button").addEventListener("click", function (a) {
                                            (overlay.style.display = "none"), (info.style.display = "none");
                                        });
                                },
                            }),
                            (overlay.style.display = "block"),
                            (info.style.display = "block"),
                            (info.innerHTML =
                                '<div class="loaderIndicator"></div><div class="loaderMessage">' + pageTexts.FORM.SUBMITTING + '</div><div class="loaderButtonWrapper"><button type="button">' + pageTexts.FORM.CANCEL + "</button></div>"),
                            document.querySelector(".loaderButtonWrapper button").addEventListener("click", function (a) {
                                (overlay.style.display = "none"), (info.style.display = "none");
                            });
                    }
                }),
                userData
                    ? ((b.style.display = "none"),
                      loadJSON("GET", endPoint + "/thirdparty/rtaid/user?userData=" + userData, function (a) {
                          var d = a.user;
                          "undefined" != typeof d.mobileNumber && (c.elm.value = d.mobileNumber),
                              "undefined" != typeof d.email && (f.elm.value = d.email),
                              "undefined" != typeof d.firstName && (document.getElementById("firstName").value = d.firstName),
                              "undefined" != typeof d.lastName && (document.getElementById("lastName").value = d.lastName),
                              content.removeChild(j),
                              (b.style.display = "block");
                      }))
                    : content.removeChild(j);
        } else if ("FAQ" == page) content.innerHTML = "FAQ";
        else if ("BOOKINGS" == page)
            (content.innerHTML = pageData.BODY),
                (pageTexts = pageData),
                getCloudData({
                    dataSafeKey: "bookings",
                    success: function (a) {
                        if ("undefined" != typeof a.dataSafeValue)
                            try {
                                var b = JSON.parse(a.dataSafeValue);
                                "undefined" != typeof b.bookings &&
                                    b.bookings.length > 0 &&
                                    ((bookings = b.bookings),
                                    getCloudData({
                                        dataSafeKey: "bookingsDispatched",
                                        success: function (a) {
                                            if ("undefined" != typeof a.dataSafeValue)
                                                try {
                                                    var b = JSON.parse(a.dataSafeValue);
                                                    "undefined" != typeof b.bookings && b.bookings.length > 0 && (bookingsDispatched = b.bookings);
                                                } catch (c) {}
                                        },
                                    }),
                                    getCloudData({
                                        dataSafeKey: "bookingsPerformed",
                                        success: function (a) {
                                            if ("undefined" != typeof a.dataSafeValue)
                                                try {
                                                    var b = JSON.parse(a.dataSafeValue);
                                                    "undefined" != typeof b.bookings && b.bookings.length > 0 && (bookingsPerformed = b.bookings);
                                                } catch (c) {}
                                        },
                                    }));
                            } catch (c) {}
                        updateBookingList({});
                    },
                });
        else if ("BOOKING" == page) {
            (content.innerHTML = pageData.BODY), (pageTexts = pageData);
            var p = {};
            try {
                p = JSON.parse(decodeURIComponent(bookingData));
            } catch (q) {
                alert("could not parse bookingData");
            }
            var r = (document.getElementById("booking"), document.getElementById("booking_locations")),
                s = document.getElementById("booking_options"),
                t = document.getElementById("booking_summary"),
                u = document.getElementById("booking_button");
            if (null == operator || "taxi" == operator) var v = !0;
            else var v = !1;
            (r.innerHTML = pageTexts.LOCATIONS), v ? (s.innerHTML = pageTexts.OPTIONS) : (s.innerHTML = pageTexts.OPTIONS_LIMO), (t.innerHTML = pageTexts.SUMMARY), (u.innerHTML = pageTexts.BUTTON);
            var w = "";
            "undefined" != typeof p.origin.address ? (w = p.origin.address) : "undefined" != typeof p.origin.location.coordinates && (w = p.origin.location.coordinates[0] + ", " + p.origin.location.coordinates[1]);
            var x = "";
            "undefined" != typeof p.destination.address ? (x = p.destination.address) : "undefined" != typeof p.destination.location.coordinates && (x = p.destination.location.coordinates[0] + ", " + p.destination.location.coordinates[1]),
                document.getElementById("booking_form").addEventListener("submit", function (a) {
                    a.preventDefault(),
                        (overlay.style.display = "block"),
                        (info.style.display = "block"),
                        (info.innerHTML =
                            '<div class="loaderIndicator"></div><div class="loaderMessage">' + pageTexts.BOOKINGLOADINGMESSAGE + '</div><div class="loaderButtonWrapper"><button type="button">' + pageTexts.CANCEL + "</button></div>"),
                        document.querySelector(".loaderButtonWrapper button").addEventListener("click", function (a) {
                            (overlay.style.display = "none"), (info.style.display = "none");
                        });
                    var b = null,
                        c = null;
                    v ? ((b = "dubaiTaxi"), (c = "taxi")) : ((b = "dtcLimousine"), (c = "limo"));
                    var d = { operator: b, origin: JSON.parse(JSON.stringify(p.origin)), destination: JSON.parse(JSON.stringify(p.destination)), time: p.time, traveler: p.traveler, travelOptions: [] };
                    rtaId && (d.userToken = rtaId), debug && (d.debug = !0);
                    var e = document.querySelector('input[name="travelOptions"]:checked').value;
                    e.length > 0 && d.travelOptions.push(e), "" != document.getElementById("booking_note").value.trim() && (d.noteToDriver = document.getElementById("booking_note").value.trim());
                    try {
                        delete d.origin.address;
                    } catch (f) {}
                    try {
                        delete d.destination.address;
                    } catch (f) {}
                    document.getElementById("bookingUserStreet") &&
                        "" != document.getElementById("bookingUserStreet").value.trim() &&
                        document.getElementById("bookingUserHouse") &&
                        "" != document.getElementById("bookingUserHouse").value.trim() &&
                        document.getElementById("bookingUserSuburb") &&
                        "" != document.getElementById("bookingUserSuburb").value.trim() &&
                        (d.origin.address = {
                            city: "Dubai",
                            district: document.getElementById("bookingUserSuburb").value.trim(),
                            street: document.getElementById("bookingUserStreet").value.trim(),
                            houseno: document.getElementById("bookingUserHouse").value.trim(),
                        }),
                        postJSON({
                            url: endPointBooking + "/taxi/book?_rnd=" + new Date().getTime(),
                            postBody: JSON.stringify(d),
                            success: function (a) {
                                getCloudData({
                                    dataSafeKey: "bookings",
                                    success: function (b) {
                                        var d = { bookings: [] };
                                        "undefined" != typeof b.dataSafeValue && (d = JSON.parse(b.dataSafeValue));
                                        var e = { type: c, booking: a.booking, time: p.time, origin: p.origin, destination: p.destination };
                                        d.bookings.push(e),
                                            saveCloudData({
                                                dataSafeKey: "bookings",
                                                dataSafeValue: JSON.stringify(d),
                                                success: function (b) {
                                                    if ("undefined" != typeof a.booking.confirmation) {
                                                        var d = "<div><h2>" + ulang.BOOKING.BOOKINGCONFIRMED + "</h2></div>";
                                                        (d += "<div>" + ulang.BOOKING.BOOKINGREFNO + " #" + a.booking.confirmation.confirmationId + "</div>"),
                                                            showPopUPMessage(null, d, ulang.GLOBAL.BUTNS.OK, function () {
                                                                window.location.href = "shailapp://bookings/show?booking=" + encodeURIComponent(JSON.stringify(a.booking));
                                                            }),
                                                            "taxi" == c
                                                                ? (_paq.push(["trackEvent", "book-taxi", "type: dubaiTaxi; origin: " + w + "; destination " + x + "; fare: " + selectedFare + "; duration: " + p.duration]),
                                                                  _paq.push(["trackEvent", "estimated-fare", "Fare", "Taxi", selectedFare]),
                                                                  _paq.push(["trackEvent", "estimated-journey-time", "Time", "Taxi", p.duration]))
                                                                : "limo" == c &&
                                                                  (_paq.push(["trackEvent", "book-taxi", "type: dtc; origin: " + w + "; destination " + x + "; fare: " + selectedFare + "; duration: " + p.duration]),
                                                                  _paq.push(["trackEvent", "estimated-fare", "Fare", "Limo", selectedFare]),
                                                                  _paq.push(["trackEvent", "estimated-journey-time", "Time", "Limo", p.duration]));
                                                    }
                                                },
                                                error: function () {
                                                    var a = "<div><h2>" + ulang.BOOKING.BOOKINGERROR_HEAD + "</h2></div>";
                                                    (a += "<div>error saveCloudData</div>"),
                                                        showPopUPMessage(
                                                            null,
                                                            a,
                                                            ulang.GLOBAL.BUTNS.RETRY,
                                                            function () {
                                                                try {
                                                                    document.getElementById("booking_form").dispatchEvent(new Event("submit"));
                                                                } catch (a) {}
                                                            },
                                                            ulang.GLOBAL.BUTNS.CANCEL,
                                                            function () {}
                                                        ),
                                                        _paq.push(["trackEvent", "booking-error", c]);
                                                },
                                            });
                                    },
                                    error: function () {
                                        var a = "<div><h2>" + ulang.BOOKING.BOOKINGERROR_HEAD + "</h2></div>";
                                        (a += "<div>error getCloudData</div>"),
                                            showPopUPMessage(
                                                null,
                                                a,
                                                ulang.GLOBAL.BUTNS.RETRY,
                                                function () {
                                                    try {
                                                        document.getElementById("booking_form").dispatchEvent(new Event("submit"));
                                                    } catch (a) {}
                                                },
                                                ulang.GLOBAL.BUTNS.CANCEL,
                                                function () {}
                                            ),
                                            _paq.push(["trackEvent", "booking-error", c]);
                                    },
                                });
                            },
                            error: function (a) {
                                if (901 == a.status) {
                                    var b = "<div>" + ulang.BOOKING.BOOKINGERROR_ADDRESS_REQUIRED + "</div>";
                                    (b += '<div class="booking_error_address">' + ulang.BOOKING.BOOKINGERROR_ADDRESS_BODY + "</div>"),
                                        showPopUPMessage(
                                            null,
                                            b,
                                            ulang.GLOBAL.BUTNS.CONFIRM,
                                            function () {
                                                try {
                                                    document.getElementById("booking_form").dispatchEvent(new Event("submit"));
                                                } catch (a) {}
                                            },
                                            ulang.GLOBAL.BUTNS.CANCEL,
                                            function () {
                                                document.getElementById("bookingUserStreet") && (document.getElementById("bookingUserStreet").value = ""),
                                                    document.getElementById("bookingUserHouse") && (document.getElementById("bookingUserHouse").value = ""),
                                                    document.getElementById("bookingUserSuburb") && (document.getElementById("bookingUserSuburb").value = "");
                                            }
                                        ),
                                        _paq.push(["trackEvent", "booking-error", c]),
                                        document.getElementById("bookingAddressStreet").addEventListener("blur", function (a) {
                                            if (!document.getElementById("bookingUserStreet")) {
                                                var b = document.createElement("input");
                                                (b.type = "hidden"), (b.id = "bookingUserStreet"), r.appendChild(b);
                                            }
                                            document.getElementById("bookingUserStreet").value = document.getElementById("bookingAddressStreet").value;
                                        }),
                                        document.getElementById("bookingAddressHouse").addEventListener("blur", function (a) {
                                            if (!document.getElementById("bookingUserHouse")) {
                                                var b = document.createElement("input");
                                                (b.type = "hidden"), (b.id = "bookingUserHouse"), r.appendChild(b);
                                            }
                                            document.getElementById("bookingUserHouse").value = document.getElementById("bookingAddressHouse").value;
                                        }),
                                        document.getElementById("bookingAddressSuburb").addEventListener("blur", function (a) {
                                            if (!document.getElementById("bookingUserSuburb")) {
                                                var b = document.createElement("input");
                                                (b.type = "hidden"), (b.id = "bookingUserSuburb"), r.appendChild(b);
                                            }
                                            document.getElementById("bookingUserSuburb").value = document.getElementById("bookingAddressSuburb").value;
                                        });
                                } else if (951 == a.status) {
                                    var d = "<div><h2>" + ulang.BOOKING.BOOKINGERROR_HEAD + "</h2></div>";
                                    (d += "<div>" + ulang.BOOKING.BOOKINGERROR_TIME_IN_PAST + "</div>"), showPopUPMessage(null, d, ulang.GLOBAL.BUTNS.OK, function () {}), _paq.push(["trackEvent", "booking-error", c]);
                                } else {
                                    var b = "<div><h2>" + ulang.BOOKING.BOOKINGERROR_HEAD + "</h2></div>";
                                    (b += "<div>" + ulang.BOOKING.BOOKINGERROR_BODY + "</div>"),
                                        showPopUPMessage(
                                            null,
                                            b,
                                            ulang.GLOBAL.BUTNS.RETRY,
                                            function () {
                                                try {
                                                    document.getElementById("booking_form").dispatchEvent(new Event("submit"));
                                                } catch (a) {}
                                            },
                                            ulang.GLOBAL.BUTNS.CANCEL,
                                            function () {}
                                        ),
                                        _paq.push(["trackEvent", "booking-error", c]);
                                }
                            },
                        });
                });
            for (
                var y = function (a) {
                        var b = {};
                        if (
                            (p.tariffs.forEach(function (a) {
                                b[a.id.toLocaleLowerCase()] = a;
                            }),
                            isTaxiBooking())
                        )
                            var c = b.standard.price;
                        else var c = b.standard.price;
                        a.value.length > 0 && (c = b[a.value.toLowerCase()].price),
                            (document.getElementById("booking_summary_price").innerHTML = pageTexts.APPROXIMATELY + " " + formatCurrency({ value: c })),
                            0 != document.querySelectorAll(".booking_active").length && (document.querySelector(".booking_active").className = ""),
                            0 == isTaxiBooking() ? (a.parentNode.className = "booking_active_limo") : (a.parentNode.className = "booking_active"),
                            (selectedFare = parseFloat(c) / 100);
                    },
                    z = document.querySelectorAll('input[name="travelOptions"]'),
                    A = [],
                    k = 0;
                k < z.length;
                k++
            )
                A.push(z[k]);
            A.forEach(function (a) {
                a.addEventListener("change", function (b) {
                    y(a);
                });
            }),
                (document.getElementById("booking_from").innerHTML = w),
                (document.getElementById("booking_to").innerHTML = x);
            var B = {};
            p.tariffs.forEach(function (a) {
                B[a.id.toLocaleLowerCase()] = a;
            }),
                v
                    ? ((document.getElementById("booking_options_normal_price").innerHTML = formatCurrency({ value: B.standard.price })),
                      (document.getElementById("booking_options_normal_name").innerText = B.standard.name),
                      (document.getElementById("booking_options_van_price").innerHTML = formatCurrency({ value: B.van.price })),
                      (document.getElementById("booking_options_van_name").innerText = B.van.name),
                      (document.getElementById("booking_options_women_price").innerHTML = formatCurrency({ value: B.women.price })),
                      (document.getElementById("booking_options_women_name").innerText = B.women.name))
                    : ((document.getElementById("booking_options_limo_price").innerHTML = formatCurrency({ value: B.standard.price })), (document.getElementById("booking_options_limo_name").innerText = B.standard.name));
            var C = p.time + "",
                D = C.split("T")[0].split("-")[2] + "/" + C.split("T")[0].split("-")[1] + "/" + C.split("T")[0].split("-")[0],
                E = parseInt(C.split("T")[1].split("+")[0].split("Z")[0].split(":")[0], 10);
            E < 10 && (E = "0" + E);
            var F = parseInt(C.split("T")[1].split("+")[0].split("Z")[0].split(":")[1], 10);
            F < 10 && (F = "0" + F);
            var G = E + ":" + F;
            (document.getElementById("booking_summary_time").innerHTML = D + "<br> " + pageTexts.ESTIMATEDTIME + " " + G),
                (document.getElementById("booking_summary_duration").innerHTML = p.duration),
                y(v ? document.getElementById("booking_options_normal") : document.getElementById("booking_options_limo"));
        } else if ("BALANCE" == page) includeJs("lib/js/modules/balance.js");
        else if ("PROFILE" == page) includeJs("lib/js/modules/profile.js");
        else if ("STATUS" == page) {
            (content.innerHTML = pageData.BODY),
                (pageTexts = pageData),
                (document.getElementById("statusRight").innerHTML =
                    '<div class="status_row">' +
                    pageTexts.NAME +
                    ' <span id="driver_name"></span></div><div class="status_row">' +
                    pageTexts.RATING +
                    '<span id="driver_rating"></span></div><div class="status_row">' +
                    pageTexts.DRIVERID +
                    ' <span id="driver_id"></span></div><div class="status_row" id="driver_phoneNoRow" style="display:none;">' +
                    pageTexts.PHONENO +
                    ' <span id="driver_phoneNo"></span></div>');
            var H = { processId: processId };
            debug && (H.debug = !0),
                postJSON({
                    url: endPointBooking + "/taxi/status?_rnd=" + new Date().getTime(),
                    postBody: JSON.stringify(H),
                    success: function (a) {
                        if ("undefined" != typeof a.response && "undefined" != typeof a.response.statuses && "undefined" != typeof a.response.statuses[0] && "undefined" != typeof a.response.statuses[0].driver) {
                            var b = a.response.statuses[0].driver;
                            (document.getElementById("driver_id").innerHTML = b.driverId || ""),
                                "undefined" != typeof b.phoneNo && "" != b.phoneNo && ((document.getElementById("driver_phoneNo").innerHTML = b.phoneNo), (document.getElementById("driver_phoneNoRow").style.display = ""));
                            for (var c = " ", d = b.rating || 0, e = parseInt(parseFloat(d).toFixed(0), 10), f = 0; f < e; f++) c += '<span class="status-rating"> </span>';
                            if (e < 5) for (var f = 0; f < 5 - e; f++) c += '<span class="status-rating-disabled"> </span>';
                            document.getElementById("driver_rating").innerHTML = c;
                            var g = b.givenName || "",
                                h = b.lastName || "";
                            document.getElementById("driver_name").innerHTML = g + " " + h;
                            try {
                                "undefined" != typeof b.image && b.image.url && (document.getElementById("statusLeft").style.backgroundImage = "url('" + b.image.url + "')");
                            } catch (i) {}
                        } else alert("error driver details");
                    },
                    error: function () {
                        alert("error driver details");
                    },
                });
        } else {
			
            var I = document.createElement("div");

		if( "CONTACT" == page ){
			if(lang=="en"){
				document.location.replace("/wv/contact/index.html?lang=en");
			}else if(lang == "ur"){
				document.location.replace("/wv/contact/index.html?lang=ur");
			}else if(lang == "ar"){
				document.location.replace("/wv/contact/index.html?lang=ar");
			}else if(lang == "hi"){
				document.location.replace("/wv/contact/index.html?lang=hi");
			}else if(lang == "ru"){
				document.location.replace("/wv/contact/index.html?lang=ru");
			}else if(lang == "fr"){
				document.location.replace("/wv/contact/index.html?lang=fr");
			}else if(lang == "es"){
				document.location.replace("/wv/contact/index.html?lang=es");
			}else if(lang == "de"){
				document.location.replace("/wv/contact/index.html?lang=de");
			}else if(lang == "cn"){
				document.location.replace("/wv/contact/index.html?lang=cn");
			}else if(lang == "zh"){
				document.location.replace("/wv/contact/index.html?lang=ch");
			}
		}
		 if( "TERMS" == page ){
			if(lang=="en"){
				document.location.replace("/wv/terms/en/index.html");
			}else if(lang == "ar"){
				document.location.replace("/wv/terms/ar/index.html");
			}
		}

		var I = document.createElement("div");
		if (((I.className = "contentInner"), (I.innerHTML = pageData.BODY || pageData.TITLE), (content.innerHTML = ""), content.appendChild(I), "ABOUT" == page)) {
                try {
                    document.getElementById("about_version").innerHTML = version;
                } catch (q) {}
                try {
                    "true" == displayFeedbackText && (document.getElementById("feedbackParagraph").style.display = "");
                } catch (q) {}
            }
        }
    });
var _paq = _paq || [],
    piwikOverwriteObj = {};
getParameterByName("piwikUrl") &&
    getParameterByName("piwikProjectId") &&
    getParameterByName("piwikUdid") &&
    (_paq.push(["setUserId", getParameterByName("piwikUdid")]),
    getParameterByName("piwikData") && (piwikOverwriteObj = JSON.parse(getParameterByName("piwikData"))),
    (function () {
        var a = getParameterByName("piwikUrl");
        a.indexOf("piwik.php") !== -1 && (a = a.replace("piwik.php", "")),
            "/" !== a.substr(a.length - 1, 1) && (a += "/"),
            _paq.push(["setTrackerUrl", a + "piwik.php"]),
            _paq.push(["setSiteId", getParameterByName("piwikProjectId")]),
            getParameterByName("piwikCustomUrl") ? _paq.push(["setCustomUrl", getParameterByName("piwikCustomUrl")]) : getParameterByName("customUrl") && _paq.push(["setCustomUrl", getParameterByName("customUrl")]);
        var b = document,
            c = b.createElement("script"),
            d = b.getElementsByTagName("script")[0];
        (c.type = "text/javascript"), (c.async = !0), (c.defer = !0), (c.src = "lib/js/piwik.js"), d.parentNode.insertBefore(c, d);
    })());