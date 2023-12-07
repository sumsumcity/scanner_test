$(document).ready(function(){
    $(".open-delete-modal").click(function(){
        var userId = $(this).data('id');
        $("#deleteModal .delete-btn").data('id', userId); // Store user id in delete button
        $("#deleteModal").modal('show');
    });

    $("#deleteModal .delete-btn").click(function(){
        var userId = $(this).data('id');
        $.ajax({
            url: window.location.origin + '/a0MNAc/user/' + userId,
            type: 'DELETE',
            success: function(result) {
                // Do something with the result
                location.reload();
            }
        });
    });
});