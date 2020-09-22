/*
 Template Name: Admiria - Bootstrap 4 Admin Dashboard
 Author: Themesbrand
 File: Sweet Alert init js
 */

!(function ($) {
    "use strict"

    var SweetAlert = function () {}

    //examples
    ;(SweetAlert.prototype.init = function () {
        //Basic
        $("#sa-basic").on("click", function () {
            Swal.fire("Any fool can use a computer")
        })

        //A title with a text under
        $("#sa-title").click(function () {
            Swal.fire("The Internet?", "That thing is still around?", "question")
        })

        //Success Message
        $("#sa-success").click(function () {
            Swal.fire({
                title: "Good job!",
                text: "You clicked the button!",
                type: "success",
                showCancelButton: true,
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger m-l-10",
            })
        })

        //Warning Message
        $("#sa-warning").click(function () {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger m-l-10",
                confirmButtonText: "Yes, delete it!",
            }).then(function () {
                Swal.fire("Deleted!", "Your file has been deleted.", "success")
            })
        })

        //Parameter
        $("#sa-params").click(function () {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger m-l-10",
                buttonsStyling: false,
            }).then(
                function () {
                    Swal.fire("Deleted!", "Your file has been deleted.", "success")
                },
                function (dismiss) {
                    // dismiss can be 'cancel', 'overlay',
                    // 'close', and 'timer'
                    if (dismiss === "cancel") {
                        Swal.fire("Cancelled", "Your imaginary file is safe :)", "error")
                    }
                }
            )
        })

        // #sa-delete
        $(".sa-delete").click(function () {
            const uid = this.dataset.uid
            const _csrf = document.querySelector('meta[name="csrf-token"]').getAttribute("content")
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger m-l-10",
                buttonsStyling: false,
                allowOutsideClick: false,
            }).then(function (e) {
                // confirm => {value: true}
                // cancel => {dismiss: "cancel"}
                if (e.value === true) {
                  let urlSegments = document.URL.split("/").filter((value) => {
                    return value != "admins" && value != "customers" && value != "edit" && value != "#"
                  })
                  const toURL = urlSegments.join("/") + "/" + uid
                  // send request to api server
                  const xmlhttp = new XMLHttpRequest()
                  xmlhttp.open("DELETE", toURL, true)
                  xmlhttp.onreadystatechange = function () {
                      if (this.readyState == 4 && this.status == 200) {
                        Swal.fire("Deleted!", "Your file has been deleted.", "success")
                        return setInterval(() => {
                            location.reload()
                        }, 500)
                      } else {
                          Swal.fire("Failed", "An error has occurred.", "error")
                      }
                  }

                  xmlhttp.setRequestHeader("CSRF-Token", _csrf)
                  xmlhttp.withCredentials = true
                  xmlhttp.send()
                }
            })
        })

        // #sa-activate
        $(".sa-activate").on("click", function () {
            const uid = this.dataset.uid
            const _csrf = document.querySelector('meta[name="csrf-token"]').getAttribute("content")
            Swal.fire({
                title: "Activate",
                text: "Do you want to activate it?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, do it!",
                cancelButtonText: "No, cancel!",
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger m-l-10",
                buttonsStyling: false,
                allowOutsideClick: false,
            }).then(function (e) {
                // confirm => {value: true}
                // cancel => {dismiss: "cancel"}
                if (e.value === true) {
                    let urlSegments = document.URL.split("/").filter((value) => {
                        return value != "admins" && value != "customers" && value != "edit" && value != "#"
                    })
                    const toURL = urlSegments.join("/") + "/activate/" + uid
                    // send request to api server
                    const xmlhttp = new XMLHttpRequest()
                    xmlhttp.open("PUT", toURL, true)
                    xmlhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            Swal.fire("Activated!", "It was successfully activated.", "success")
                            return setInterval(() => {
                                location.reload()
                            }, 500)
                        } else {
                            Swal.fire("Failed", "An error has occurred.", "error")
                        }
                    }

                    xmlhttp.setRequestHeader("CSRF-Token", _csrf)
                    xmlhttp.withCredentials = true
                    xmlhttp.send()
                }
            })
        })

        // #sa-deactivate
        $(".sa-deactivate").on("click", function () {
            const uid = this.dataset.uid
            const _csrf = document.querySelector('meta[name="csrf-token"]').getAttribute("content")
            Swal.fire({
                title: "Deactivate",
                text: "Do you want to deactivate it?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, do it!",
                cancelButtonText: "No, cancel!",
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger m-l-10",
                buttonsStyling: false,
                allowOutsideClick: false,
            }).then(function (e) {
                // confirm => {value: true}
                // cancel => {dismiss: "cancel"}
                if (e.value === true) {
                    let urlSegments = document.URL.split("/").filter((value) => {
                        return value != "admins" && value != "customers" && value != "edit" && value != "#"
                    })
                    const toURL = urlSegments.join("/") + "/deactivate/" + uid
                    const xmlhttp = new XMLHttpRequest()
                    // send request to api server
                    xmlhttp.open("PUT", toURL, true)
                    xmlhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            Swal.fire("Deactivated!", "It was successfully deactivated.", "success")
                            return setInterval(() => {
                                location.reload()
                            }, 500)
                        } else {
                            Swal.fire("Failed", "An error has occurred.", "error")
                        }
                    }

                    xmlhttp.setRequestHeader("CSRF-Token", _csrf)
                    xmlhttp.withCredentials = true
                    xmlhttp.send()
                }
            })
        })

        // #sa-reset-pwd
        $(".sa-reset-pwd").click(function () {
            const uid = e.target.dataset.uid
            const _csrf = document.querySelector('meta[name="csrf-token"]').getAttribute("content")
            Swal.fire({
                title: "Reset password",
                text: "Do you want to reset password of this account?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, do it!",
                cancelButtonText: "No, cancel!",
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger m-l-10",
                buttonsStyling: false,
                allowOutsideClick: false,
            }).then(function (e) {
                // confirm => {value: true}
                // cancel => {dismiss: "cancel"}
                if (e.value === true) {
                    const xmlhttp = new XMLHttpRequest()
                    xmlhttp.open("PUT", document.URL + "/reset_password/" + uid, true)

                    xmlhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            Swal.fire(
                                "Successfully!",
                                "The password was successfully reset.",
                                "success"
                            )
                        } else {
                            Swal.fire("Failed", "An error has occurred.", "error")
                        }
                    }

                    xmlhttp.setRequestHeader("CSRF-Token", _csrf)
                    xmlhttp.withCredentials = true
                    xmlhttp.send()
                }
            })
        })

        //Custom Image
        $("#sa-image").click(function () {
            Swal.fire({
                title: "Sweet!",
                text: "Modal with a custom image.",
                imageUrl: "assets/images/logo-sm-dark.png",
                imageHeight: 38,
                animation: false,
            })
        })

        //Auto Close Timer
        $("#sa-close").click(function () {
            let timerInterval
            Swal.fire({
                title: "Auto close alert!",
                html: "I will close in <strong></strong> seconds.",
                timer: 2000,
                onBeforeOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Swal.getTimerLeft()
                    }, 100)
                },
                onClose: () => {
                    clearInterval(timerInterval)
                },
            }).then((result) => {
                if (
                    // Read more about handling dismissals
                    result.dismiss === Swal.DismissReason.timer
                ) {
                    console.log("I was closed by the timer")
                }
            })
        })

        //custom html alert
        $("#custom-html-alert").click(function () {
            Swal.fire({
                title: "<i>HTML</i> <u>example</u>",
                type: "info",
                html:
                    "You can use <b>bold text</b>, " +
                    '<a href="//Themesbrand.in/">links</a> ' +
                    "and other HTML tags",
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger m-l-10",
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
                cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
            })
        })

        //Custom width padding
        $("#custom-padding-width-alert").click(function () {
            Swal.fire({
                title: "Custom width, padding, background.",
                width: 600,
                padding: 100,
                background:
                    "#fff url(//subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/geometry.png)",
            })
        })

        //Ajax
        $("#ajax-alert").click(function () {
            Swal.fire({
                title: "Submit email to run ajax request",
                input: "email",
                showCancelButton: true,
                confirmButtonText: "Submit",
                showLoaderOnConfirm: true,
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger m-l-10",
                preConfirm: function (email) {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            if (email === "taken@example.com") {
                                reject("This email is already taken.")
                            } else {
                                resolve()
                            }
                        }, 2000)
                    })
                },
                allowOutsideClick: false,
            }).then(function (email) {
                swal({
                    type: "success",
                    title: "Ajax request finished!",
                    html: "Submitted email: " + email,
                })
            })
        })

        //chaining modal alert
        $("#chaining-alert").click(function () {
            Swal.mixin({
                input: "text",
                confirmButtonText: "Next &rarr;",
                showCancelButton: true,
                progressSteps: ["1", "2", "3"],
            })
                .queue([
                    {
                        title: "Question 1",
                        text: "Chaining swal2 modals is easy",
                    },
                    "Question 2",
                    "Question 3",
                ])
                .then((result) => {
                    if (result.value) {
                        Swal.fire({
                            title: "All done!",
                            html:
                                "Your answers: <pre><code>" +
                                JSON.stringify(result.value) +
                                "</code></pre>",
                            confirmButtonText: "Lovely!",
                        })
                    }
                })
        })

        //Danger
        $("#dynamic-alert").click(function () {
            swal.queue([
                {
                    title: "Your public IP",
                    confirmButtonText: "Show my public IP",
                    text: "Your public IP will be received " + "via AJAX request",
                    showLoaderOnConfirm: true,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            $.get("https://api.ipify.org?format=json").done(function (data) {
                                swal.insertQueueStep(data.ip)
                                resolve()
                            })
                        })
                    },
                },
            ])
        })
    }),
        //init
        ($.SweetAlert = new SweetAlert()),
        ($.SweetAlert.Constructor = SweetAlert)
})(window.jQuery),
    //initializing
    (function ($) {
        "use strict"
        $.SweetAlert.init()
    })(window.jQuery)
