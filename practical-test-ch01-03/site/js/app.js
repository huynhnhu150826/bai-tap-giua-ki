// Câu 2: viết JavaScript tại đây

const API_URL = 'http://localhost:4000';

// Hàm có sẵn: đổi giờ UTC sang giờ Việt Nam, vd "08:00 12/09/2026"
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });



// Câu 2a: Định dạng số chỗ còn lại
const formatSeats = (event) => {
  const remaining = event.capacity - event.registreredCount;
  if (remaining <= 0) {
    return "Hết chỗ";
  }
    return `Còn ${remaining}/${event.capacity} chỗ`;
};

// Câu 2b: Tạo card sự kiện bằng DOM API
const renderEvents = (events) => {
  const eventlist = document.getElementById("event-list");

  const cards = events.map((event) => {
    const article = document.createElement("article");
    article.setAttribute("class", "event-card");

    const img = document.createElement("img");
    img.setAttribute("src", "img/event.svg");
    img.setAttribute("alt", event.name);

    const h2 = document.createElement("h2");
    const link = document.createElement("a");
    link.setAttribute("href", `event-detail.hmtl?id=${event.id}`);
    link.textContent = event.name;
    h2.appendChild(link);

    const pTime = document.createElement("p");
    pTime.setAttribute("class", "event-time");
    const timeEl = document.createElement("time");
    timeEl.setAttribute("datetime", event.startTime);
    timeEl.textContent = formatDateTime(event.startTime);
    pTime.appendChild(timeEl);

    const pLocation = document.createElement("p");
    pLocation.setAttribute("class", "event-location");
    pLocation.textContent = event.location;

    const pSlots = document.createElement("p");
    pSlots.setAttribute("class", "event-slots");
    const seatText = formatSeats(event);

    if (seatText === "Hết chỗ") {
      const badge = document.createElement("span");
      badge.setAttribute("class", "badge-full");
      badge.textContent = seatText;
      pSlots.appendChild(badge);
    } else {
      pSlots.textContent = seatText;
    }
    article.append(img, h2, pTime, pLocation, pSlots);
    return article;
  });

  eventlist.replaceChildren(...cards);
};

// Câu 2c: Gọi API và xử lý tìm kiếm
const loadEvents = async (keyword = "") => {
  const statusEl = document.getElementById("status");
  const eventlist = document.getElementById("event-list");
  const trimmedKeyword = keyword.trim();

  const params = new URLSearchParams();
  params.set("pageSize", "50");
  if (trimmedKeyword !== "") {
    params.set("q", trimmedKeyword);
  }

  statusEl.textContent = "Đang tải...";

  try {
    // Lưu ý có /api/events vì API_URL chưa có /api
    const response = await fetch(`${API_URL}/api/events?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();
    const events = data.items || [];

    renderEvents(events);

    if (events.length === 0) {
      statusEl.textContent = "Không có sự kiện nào khớp từ khóa.";
    } else {
      statusEl.textContent = `Tìm thấy ${events.length} sự kiện.`;
    }
  } catch (error) {
    eventlist.replaceChildren();
    statusEl.textContent = "Không tải được dữ liệu, vui lòng thử lại"; 
  }
};

// Gắn sự kiện cho form tìm kiếm và tải dữ liệu ban đầu
const searchForm = document.getElementById("search-form");
const keywordInput = document.getElementById("keyword");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loadEvents(keywordInput.value);
});

loadEvents();