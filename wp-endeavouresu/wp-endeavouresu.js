

$("#update").click(function(e) {
  e.preventDefault();
  var name = $("#name").val(); 
  var last_name = $("#last_name").val();
  var dataString = 'name='+name+'&last_name='+last_name;
  $.ajax({
    type:'POST',
    data:dataString,
    url:'insert.php',
    success:function(data) {
      alert(data);
    }
  });
});