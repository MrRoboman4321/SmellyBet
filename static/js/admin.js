$(document).ready(() => {
    console.log("Ready!");
    $.get("/users", null, null, "json").done((users) =>{
        for (var i = 0; i < users.length; i++) {
            console.log(users[i])
            $('#userTable > tbody:last-child').append('<tr><td>' + users[i].username + '</td</tr>');
        }
    })
});
