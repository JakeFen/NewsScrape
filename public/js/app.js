if (
  window.location.href === "http://localhost:3000/" ||
  window.location.href === "https://nyt-scraper-site.herokuapp.com/"
) {
  $.getJSON("/articles", data => {
    // For each one
    if (data.length > 1) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].saved === false) {
          $("#articles").append(
            `<div class="card">
            <div class="card-head">
            <h3>
                <a class="article-link primary-text" target="_blank" href="https://www.nytimes.com/ ${data[i].link}">${data[i].title}</a>
            </h3>
            <a class="save-article primary-text" data_id="${data[i]._id}">SAVE ARTICLE</a>

            </div>

            <div class="card-body">
            <p>${data[i].message}</p>
            </div>
           </div>`
          );
        }
      }
    } else {
      console.log("Something");
      $("#articles").append(
        `<div><h2 class="primary-text text-center empty-alert">Looks like there's no articles..</h2></div>`
      );
      $("#articles").append(`
    <div class="card">
        <div class="block card-head primary-text">
            <h3 class="text-center">What Would You Like To Do?</h3>
        </div>
    <ul class="text-center card-body">
        <li>
        <a class="secondary-text">Try Scraping for New Articles</a>
        </li>
        <li>
        <a class="secondary-text" href="/saved">Go to Saved Articles</a>
        </li>
    </ul>
    </div>`);
    }
  });
} else if (
  window.location.href === "http://localhost:3000/saved" ||
  window.location.href === "https://nyt-scraper-site.herokuapp.com/saved"
) {
  $.getJSON("/articles", data => {
    // For each one
    if (data.length > 1) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].saved === true) {
          $("#articles").append(
            `<div class="card">
    <div class="card-head">
        <h3>
            <a class="article-link primary-text" target="_blank" href="https://www.nytimes.com/ ${data[i].link}">${data[i].title}</a>
        </h3>
        <div class="button-container">
            <a class="delete-article primary-text" data_id="${data[i]._id}">DELETE FROM SAVED</a>
            <a class="add-note primary-text" data_id="${data[i]._id}">ARTICLE NOTES</a>
        </div>
    </div>
      
    <div class="card-body">
    <p>${data[i].message}</p>
    </div>
</div>`
          );
        }
      }
    } else {
      $("#articles").append(
        `<div><h2 class="primary-text text-center empty-alert">Looks like we have no saved articles..</h2></div>`
      );
      $("#articles").append(`
          <div class="card">
              <div class="block card-head primary-text">
                  <h3 class="text-center">Try Browsing Available Articles</h3>
              </div>
          <ul class="text-center card-body">
              <li>
              <a class="secondary-text" href="/">Browse Articles</a>
              </li>
          </ul>
          </div>`);
    }
  });
} else {
}

$("#scrape").on("click", () => {
  $.get("/scrape", data => {
    location.reload();
  });
});

$("#clear-articles").on("click", () => {
  event.preventDefault();
  $.ajax("/api/clear", {
    type: "DELETE"
  }).then(function() {
    location.reload();
  });
});

$(document).on("click", "a.save-article", function() {
  event.preventDefault();
  console.log("click");
  var id = $(this).attr("data_id");

  $.post("/api/save/" + id, data => {
    location.reload();
  });
});

$(document).on("click", "a.delete-article", function() {
  event.preventDefault();
  var id = $(this).attr("data_id");
  // $.post("/api/article/" + id, data => {
  //     location.reload();
  // })
  $.ajax("/api/delete/" + id, {
    type: "DELETE"
  }).then(() => {
    location.reload();
  });
});

$(".close-button").on("click", function() {
  $(".all-notes").empty();
  $(".note").hide();
});

const currentId = {
  articleId: ""
};

$(document).on("click", "a.add-note", function() {
  currentId.articleId = $(this).attr("data_id");
  $("submit-button").addClass("data_id", currentId.articleId);
  $(".note-title").text(`Notes for Article: ${currentId.articleId}`);
  $.get("/article/" + currentId.articleId, data => {
    if (data) {
      console.log(data)
      for (var i = 0; i < 1; i++) {
        $(".all-notes").append(
          `<li>${data.note.body}<button class="btn note-delete" data_id="${data.note._id}">X</button></li>`
        );
      }
    } else {
      $(".all-notes").append(`<li>No notes for this article yet.</li>`);
    }
  });

  $(".note").show();
});

$(document).on("click", "button.note-delete", function() {
  event.preventDefault();
  var id = $(this).attr("data_id");
  // $.post("/api/article/" + id, data => {
  //     location.reload();
  // })
  $.ajax("/api/delete/note" + id, {
    type: "DELETE"
  }).then(() => {
    $(".note").hide();
  });
});

$(".submit-button").on("click", function() {
  articleId = currentId.articleId;

  $.ajax({
    method: "POST",
    url: "/articles/" + articleId,
    data: {
      // Value taken from note textarea
      body: $("#note-textarea").val()
    }
  }).then(function(data) {
    // Empty the notes section
    $("#notes").empty();
  });
  $(".all-notes").empty();
  $("#note-textarea").val("");

  $(".note").hide();
});
