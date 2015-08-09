

function RetreiveData(query, SuccessCB,FailureCB) {


    $.ajax({
        url: query,
        data: {
            format: 'json'
        },
        error: function () {
            FailureCB();
        },
        dataType: 'json',
        success: function (data) {
            SuccessCB(data);
        },
        type: 'GET'
    });

}




