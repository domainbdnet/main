$(document).ready(function () {
    $('#domainForm').submit(function (e) {
        e.preventDefault();
        var domainName = $('#domainName').val().trim();
        if (domainName) {
            toggleButton(true); // Disable the button and show loading text
            $('#result').empty(); // Clear previous results
            checkDomainAvailability(domainName);
        } else {
            displayMessage('Please enter a domain name', 'warning');
            toggleButton(false); // Enable the button and revert text
        }
    });
});
    
function checkDomainAvailability(domain) {
    $.ajax({
        url: 'https://domain-availability.whoisxmlapi.com/api/v1',
        type: 'GET',
        data: {
            apiKey: 'at_MpGubflvtoDuHnUMwTSSPnCaM9m2B',
            domainName: domain,
            credits: 'DB'
        },
        success: function(data) {
            toggleButton(false); // Enable the button and revert text
            if (data.DomainInfo.domainAvailability === "AVAILABLE") {
                var price = getPrice(domain);
                displayAvailableDomain(domain, price);
            } else {
                displayMessage('This domain is not available. Please try another name.', 'danger', domain);
            }
        },
        error: function() {
            displayMessage('Please make sure your domain name is correctly formatted, like "yourname.com"', 'secondary');
            toggleButton(false);
        }
    });
}
    
function getPrice(domain) {
    if (domain.endsWith('.com')) return '600';
    if (domain.endsWith('.xyz')) return '200';
    if (domain.endsWith('.net')) return '600';
    if (domain.endsWith('.org')) return '600';
    if (domain.endsWith('.info')) return '600';
    return ' Price has not been determined. Message on messenger for price ';
}
    
function displayAvailableDomain(domain, price) {
    $('#result').html(`
        <div class="availablecard card w-100 text-center bg-success text-white">
            <div class="card-body">
                <p class="card-title">Congratulations! Your domain is available for just <b>${price}</b> BDT!</p>
                <p class="card-text">${domain}</p>
                <button onclick="redirectToOrder('${domain}', '${price}')" class="btn btn-primary">Order Now for ৳${price} BDT</button>
            </div> 
        </div> 
    `);
}
    
function displayMessage(message, type, domain = '') {
    let cardClass = `bg-${type} text-white`;
    let additionalText = domain ? `<h5 class="card-text">${domain} is unavailable.</h5>` : '';
    $('#result').html(`
        <div class="unavailablecard card w-100 text-center ${cardClass}">
            <div class="card-body">
                <p class="card-text">${message}</p>
                ${additionalText}
            </div>
        </div>
    `);
}
    
function toggleButton(isLoading) {
    const button = $('#checkButton');
    if (isLoading) {
        button.attr('disabled', true);
        button.html('Checking...');
    } else {
        button.attr('disabled', false);
        button.text('Check Domain');
    }
}
    
function redirectToOrder(domain, price) {
      window.location.href = `order/index.html?domain=${encodeURIComponent(domain)}&price=${encodeURIComponent(price)}`;
   // window.location.href = `https://wa.me/8801620595906?text=domain=${encodeURIComponent(domain)}&price=${encodeURIComponent(price)}`;
}
