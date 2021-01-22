//Add listener for chrome message
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        const firstName = request.firstName
        const lastName = request.lastName

        getInfo(firstName, lastName).then(res => sendResponse(res))
        return true;
    }
);

async function getInfo(firstName, lastName) {
    const queryURL = `https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/?wt=json&q=schoolid_s%3A1413+AND
    +((teacherlastname_t:${lastName}+AND+teacherfirstname_t:${firstName}~)+OR+(teacherlastname_t:${lastName}~+AND+teacherfirstname_t:${firstName}))&sort=teacherlastname_t+asc&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+rating_class`

    const 
}



