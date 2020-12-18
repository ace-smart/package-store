var stripe = null

fetch("/create-payment-intent", {
  credentials: "same-origin", // <-- includes cookies in the request
  headers: {
    "Content-Type": "application/json",
    "CSRF-Token": fetchBody._csrf, // <-- is the csrf token as a header
  },
  method: "POST",
  body: JSON.stringify(fetchBody),
})
  .then((response) => {
    return response.json()
  })
  .then((result) => {
    return setupElements(result)
  })
  .then(function ({ stripe, card, clientSecret }) {
    document.querySelector("#checkout-btn").addEventListener("click", function (evt) {
      evt.preventDefault()
      // Initiate payment when the submit button is clicked
      const paymentMethodElement = document.querySelectorAll('input[name="paymentMethod"]')
      let paymentMethod = null
      paymentMethodElement.forEach(element => {
        if (element.checked == true) {
          paymentMethod = element.value
        }
      })

      if (paymentMethod && paymentMethod === 'COD') {
        submitCheckoutForm()
      } else {
        pay(stripe, card, clientSecret)
      }
    })
  })

// Set up Stripe.js and Elements to use in checkout form
var setupElements = function (data) {
  stripe = Stripe(PUBLISHABLE_KEY) // Your Publishable Key
  var elements = stripe.elements()
  var style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  }

  var card = elements.create("card", { style: style })
  card.mount("#card-element")
  
  return {
    stripe: stripe,
    card: card,
    clientSecret: data.client_secret,
  }
}

/*
 * Calls stripe.handleCardPayment which creates a pop-up modal to
 * prompt the user to enter extra authentication details without leaving your page
 */
var pay = function (stripe, card, clientSecret) {
  changeLoadingState(true)
  
  // Initiate the payment.
  // If authentication is required, handleCardPayment will automatically display a modal
  stripe.handleCardPayment(clientSecret, card).then(function (result) {
    if (result.error) {
      // Show error to your customer
      showError(result.error.message)
    } else {
      // The payment has been processed!
      orderComplete(clientSecret)
    }
  })
}






/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var orderComplete = function(clientSecret) {
  stripe.retrievePaymentIntent(clientSecret).then(function(result) {
    var paymentIntent = result.paymentIntent;
    
    document.querySelector(".sr-payment-form").classList.add("hidden");
    // document.querySelector("pre").textContent = paymentIntentJson;

    document.querySelector(".sr-result").classList.remove("hidden");
    
    // setTimeout(function() {
    //   document.querySelector(".sr-result").classList.add("expand");
    // }, 200);
    if (paymentIntent.status === 'succeeded') {
      submitCheckoutForm(paymentIntent.id)
    }

    changeLoadingState(false);

  });
};

var showError = function(errorMsgText) {
  changeLoadingState(false);
  var errorMsg = document.querySelector(".sr-field-error");
  var errorMsgElement = document.createElement('p')
  errorMsgElement.classList.add('text-danger')
  errorMsgElement.textContent = errorMsgText
  errorMsg.append(errorMsgElement);
  setTimeout(function() {
    errorMsgElement.textContent = "";
  }, 4000);
};

// Show a spinner on payment submission
var changeLoadingState = function(isLoading) {
  if (isLoading) {
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};

// Hide banner if window is too small
if (window.outerHeight < 600) {
  document.querySelector(".banner").classList.add("hidden");
}


var submitCheckoutForm = function(paymentIntentId = null) {
  const checkoutForm = document.getElementById('checkout-form')
  if (paymentIntentId != null) {
    const paymentIntentElement = document.createElement('input')
    paymentIntentElement.setAttribute('type', 'text')
    paymentIntentElement.setAttribute('hidden', true)
    paymentIntentElement.setAttribute('value', paymentIntentId)
    paymentIntentElement.setAttribute('name', 'paymentIntentId')
    checkoutForm.append(paymentIntentElement)
  }

  checkoutForm.submit()
}
