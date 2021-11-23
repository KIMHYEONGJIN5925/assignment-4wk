
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <link rel="icon" href="/static/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" />
    <!-- Bootstrap CSS -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
      integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2"
      crossorigin="anonymous"
    />

    <!-- Font Awesome CSS -->
    <link
      href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      rel="stylesheet"
    />
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script
      src="https://code.jquery.com/jquery-3.5.1.js"
      integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc="
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
      integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js"
      integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s"
      crossorigin="anonymous"
    ></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js"></script>

    <link href="/static/mystyle.css" rel="stylesheet" />
    <script>
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const goodsId = urlParams.get("goodsId");

      $(document).ready(function() {
        get_detail();
        $("#numberSelect").on("change", function() {
          let orderNum = parseInt($(this).val());
          $("#orderNumber").html(
            `<small class="mr-2 text-muted">총 수량 ${orderNum}개</small>${number2decimals(
              orderNum * sessionStorage.getItem("goodsPrice")
            )}`
          );
          sessionStorage.setItem("orderNum", orderNum);
        });
      });

      function sign_out() {
        $.removeCookie("mytoken", { path: "/" });
        $.removeCookie("userName", { path: "/" });
        window.location.href = "/";
      }

      function get_detail() {
        let goods = [
                {
                    "_id": "600fa6e49539b288e3c5a2cf",
                    "goodsId": 4,
                    "name": "상품 4",
                    "thumbnailUrl": "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
                    "category": "drink",
                    "price": 0.1
                },
                {
                    "_id": "600fa6e49539b288e3c5a2ce",
                    "goodsId": 3,
                    "name": "상품 3",
                    "thumbnailUrl": "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
                    "category": "drink",
                    "price": 2.2
                },
                {
                    "_id": "600fa6e49539b288e3c5a2cd",
                    "goodsId": 2,
                    "name": "상품 2",
                    "thumbnailUrl": "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
                    "category": "drink",
                    "price": 0.11
                },
                {
                    "_id": "600fa6e49539b288e3c5a2cc",
                    "goodsId": 1,
                    "name": "상품 1",
                    "thumbnailUrl": "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
                    "category": "drink",
                    "price": 6.2
                }
            ]

        let goodsDetail = goods.find((v) => v.goodsId == goodsId);
        if (!goodsDetail) {
            goodsDetail = goods[0]
        }
        
        $("#goodsUrl").attr("src", goodsDetail["thumbnailUrl"]);
        $("#goodsName").text(goodsDetail["name"]);
        $("#goodsPrice").text("$" + number2decimals(goodsDetail["price"]));

        sessionStorage.setItem("goodsId", goodsId);
        sessionStorage.setItem("goodsName", goodsDetail["name"]);
        sessionStorage.setItem("goodsPrice", goodsDetail["price"]);
        sessionStorage.setItem("orderNum", 1);
      }

      function addCart() {
        $.ajax({
          type: "POST",
          url: `/api/goods/${goodsId}/cart`,
          data: {
            quantity: sessionStorage.getItem("orderNum")
          },
          error: function(xhr, status, error) {
            if (status == 400) {
              alert("존재하지 않는 상품입니다.");
            }
            window.location.href = "/goods";
          },
          success: function(response) {
            if (response["result"] == "success") {
              $("#cartModal").modal("show");
            }
          }
        });
      }

      function buyNow() {
        sessionStorage.setItem(
          "priceSum",
          sessionStorage.getItem("goodsPrice")
        );
        sessionStorage.setItem(
          "cart",
          JSON.stringify([
            {
              goodsName: sessionStorage.getItem("goodsName"),
              quantity: sessionStorage.getItem("orderNum")
            }
          ])
        );
        window.location.href = "/order";
      }

      function number2decimals(num) {
        return (Math.round(num * 100) / 100).toFixed(2);
      }
    </script>
    <title>스파르타 쇼핑몰 | 상품 상세</title>

    <style></style>
  </head>

  <body>
    <nav
      class="navbar navbar-expand-sm navbar-dark bg-sparta justify-content-end"
    >
      <a class="navbar-brand" href="/goods">
        <img
          src="/static/logo_big_tr.png"
          width="30"
          height="30"
          class="d-inline-block align-top"
          alt=""
        />
        스파르타 쇼핑몰
      </a>
      <button
        class="navbar-toggler ml-auto"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="true"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="navbar-collapse collapse flex-grow-0 ml-auto"
        id="navbarSupportedContent"
        style=""
      >
        <ul class="navbar-nav mr-auto text-right">
          <li class="nav-item" id="link-cart">
            <a class="nav-link" href="/cart">
              장바구니<i
                class="fa fa-shopping-cart ml-2"
                aria-hidden="true"
              ></i>
            </a>
          </li>
          <li class="nav-item" id="link-logout">
            <a class="nav-link" data-toggle="modal" data-target="#signOutModal">
              로그아웃<i class="fa fa-sign-out ml-2" aria-hidden="true"></i>
            </a>
            <div
              class="modal text-left"
              id="signOutModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="signOutModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="signOutModalLabel">로그아웃</h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    로그아웃하시면 장바구니가 사라져요!
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-outline-sparta"
                      data-dismiss="modal"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      class="btn btn-sparta"
                      onclick="sign_out()"
                    >
                      로그아웃하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <div class="wrap">
      <div class="row no-gutters">
        <div class="col-sm-5">
          <img
            src="https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg"
            class="card-img-top h-100"
            alt="..."
            id="goodsUrl"
          />
        </div>
        <div class="col-sm-7 card-body px-3">
          <div class="flex-fill mt-3">
            <div class="d-flex justify-content-between mb-3">
              <h5 style="display: inline" id="goodsName">상품 1</h5>
              <span class="card-price" id="goodsPrice">$6.20</span>
            </div>

            <div class="form-group row mr-0">
              <label for="numberSelect" class="col-4 col-form-label"
                >수량</label
              >
              <select class="custom-select col-8" id="numberSelect">
                <option selected value="1">1개</option>
                <option value="2">2개</option>
                <option value="3">3개</option>
                <option value="4">4개</option>
                <option value="5">5개</option>
              </select>
            </div>
            <hr />
            <div class="row mb-3">
              <div class="col-5">총 상품금액</div>
              <div class="col-7 text-right" id="orderNumber">
                <small class="mr-2 text-muted">총 수량 1개</small>$6.20
              </div>
            </div>
            <div class="row d-flex justify-content-around">
              <div class="col-6 pr-2">
                <button
                  type="button"
                  class="btn btn-outline-sparta btn-block"
                  onclick="addCart()"
                >
                  장바구니
                </button>
              </div>
              <div class="col-6 pl-2">
                <button
                  type="button"
                  class="btn btn-sparta btn-block"
                  onclick="buyNow()"
                >
                  바로 구매
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal text-left"
      id="cartModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="cartModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cartModalLabel">알림</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            장바구니에 담았습니다! 장바구니로 갈까요?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-sparta"
              data-dismiss="modal"
            >
              취소
            </button>
            <button
              type="button"
              class="btn btn-sparta"
              onclick='window.location.href="/cart"'
            >
              장바구니
            </button>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
