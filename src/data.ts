import { VideoItem, VideoTemplate, VoiceItem, StyleItem, WorkflowNode } from "./types";

export const STYLES: StyleItem[] = [
  {
    id: "anime",
    name: "Anime",
    promptDescription: "Whimsical Japanese anime style, giant glowing mushrooms and sparkling fireflies, soft watercolor textures, studio ghibli inspired.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwX2S9syJcRKLLE709fMjJsr88sCoiztgw9isCROgBtWvzhBC0kOVJQSs9mJ6DHG-Q_WvSuEDBLJtxLi6XUDt3mRwQfp7X_o2I0-MYIkHF40P9ggThIwL5Tx-jUyAx2OLuDlJLGE-1c_CQaUpPe88NbQkPZoKmCX7GzEXBEkzrGLN8a6gnwUqQpQnx9H7wm6qeIaZYCKX6WL08RTTQOfCIhXmB89VCNpAENTGsCnxjrHejwVAnPLnCS0atadrNkgzsUB2E382IlPAq"
  },
  {
    id: "disney",
    name: "2D Disney",
    promptDescription: "Classic 2D storybook illustration with soft warm gradients, beautiful fairy-tale atmosphere, soft cozy lighting.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZv0aw2eXmCQvTTUyQfh-Ki9r983Liz2GIc3jPR0s12UpFLgdBQKQVLK8ZOdE-41Twfffo9wmLkRei5TLfmyQbpwcBiAWfFsIj9xOCA4LDz2qskPhG9W6xSlCsz-nv9mN6neIihcvMHtf6c2On3Lyk5BsKvxnjRYDv30muxBcDYVLitOHxl04-zNcYU24CpA7bDuhmsnamT7C2R4WVSczfaWrkNKUgob8kMyN_pRIchXB72WHega-KFWbVxtytUDxo2dmK0dKjQDdH"
  },
  {
    id: "clay",
    name: "3D Clay",
    promptDescription: "Tactile claymation styled round seedling, visible clay fingerprint detailing, soft glowing studio lights.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdNPSTIlE97ZzifbgV-i17SsTZh0QEXon7pa4hrUerl5b1TreLYcbEvuI8xw0IqEjwgwi9-r8L1N6eoan4HkkZ08uV7blc3X7C17bMA-QSVKHbCMlMV4nRFMeSDpCn0FHvnby8w2Xtwi3O-V6-uGoDutqUKYRrR5Px7vNncOTtrtkRWWGxv8AwX9zSfXBcG8MIBMrDpWA4MUHjE6_sSmqs6EG6XsKOCyLKWDrJuHjxNtRJMz9PhA_vkcp7A9GvOv8w17JJD54y_ltq"
  },
  {
    id: "pixel",
    name: "Pixel Art",
    promptDescription: "Charming retro 16-bit pixelated magical landscape, cute pixelated glowing items.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRoLKP87Pip0MZ0P_SUTGr5wObzPV7-svyBvQJJpATYAvMneNUaf9DKWcGTDYXS3GAurm4Gw5jmCcA7bif3SWitYVkM63z68dZXzLgSP8hDbiAQfKKKWUINdz2H0f2QSpl67X4faEV5GMGKqd_eF654K5UeJsTjiPfjaDHlMVkcr1skA_lFo8eXakw-vUQIwrx7zZRDpXIHgpOcJByJYbxBcts7bV__XwOeL4jNKrls6ouq1S6-qJTdD7c528Qzw4eZ26UTnaxFXYy"
  },
  {
    id: "ghibli",
    name: "Ghibli",
    promptDescription: "Nostalgic hand-painted background, lush rolling hills, puffy clouds, clear summer sky mood.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvNxnSh9wB3apV9gUkUY_c0LySz1dfyCcVbSs6-hkhZk5_whqIHxETJR65M0AbJddJX3zsle7HytitzRq-hMLqhh1EZUhwTMn4DR6EvNw2vLD8AhPx3Iqx9yTwDbLosd0xWeXtYnvlHys0g71niDAOiFiioNZHSO9kNBwuHKXhrQk0peo8Pg0-sUr7TFLI71GsGwbDOQA2j_snXFDO7sq9RQSms2-cofJZ2Ke6gAEH6Wywbb3omJ9hcZ5gP_tod2meVx3ESp0D9V6P"
  }
];

export const VOICES: VoiceItem[] = [
  {
    id: "bena",
    name: "Bé Na",
    gender: "Nữ",
    region: "Miền Bắc",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW_Z97IozXoi_DDRLE7dTLSKUn3C76RjtUszRaVHW2WbNpJfWPkIZiVCs3UbObzU7Ez0PnpGz4KXKGx5lSCZ0wmNZ2wsWCr8WzgL4hEVo_5-W78ET1QB6xOwaV5FknTmlKOXd5tR-4qxdcxawUSsZWFr6fwMd4MKRv8rcmwZTotFgg2FjrUD60eEs-vrYMdCC5vbcos8jl77fqxE-T4YrjVQUm_txIiSDkmsVBPgcSH-44C4D7F_NWhm21Rq-TzAn_i7r4VIA1mbJX",
    audioSample: "https://actions.google.com/sounds/v1/cartoon/cartoon_wobble.ogg"
  },
  {
    id: "ongcu",
    name: "Ông Cú Vàng",
    gender: "Nam",
    region: "Miền Nam",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuATzRpvYBwCwxz5upMm5F9oMW_0RwMY30Jq0O2vk-HKXJGJ65czaYhUFE57vnMUrEzQlr2aymR2bfrPzPMbbfzWqNR0FkB9rEUB3nPhmM1RPQ1K5IjVG0Rfd16oUgvWdFdZRP7k0wQ4x7w7ikHHhoOKCusn858IOgzwKJpYeFDkBG9TyXGvhaZSuFnbgKcDP2lwDh3F5Uts9BHGBlDKdp4nd6_3qTJArg1VbCJV6rRaUF9DmmJfZvyLT_txNBYwhdh3lXnwjw82reLp",
    audioSample: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
  },
  {
    id: "thongthai",
    name: "Robot Thông Thái",
    gender: "AI",
    region: "Toàn quốc",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM9ErgxHkKTiaFQ-kcS7zio3-xaQCC7NXkPuvE8BqWOPU45ciJ6rDUXz2fEurLHNx9fjRhCjUVJf1Bb0HYisPSWTWCzwGYvHFxdjGSbcWPOl7JozjD7cX2fzPocK5_faccPiZeKKBl8q8LkwcYLkVV-U9cKGxbBQ4WVe_pEtaUvLpWrfs7Qka344ro-0OUqeMUsQFym-AdgkO4y2NLDL6ZsK3NocIaWpuQ9HW3EP4mf5xfUrLs877I8cZoviu0WLHdMvVt-KpLft97"
  },
  {
    id: "chithongoc",
    name: "Chị Thỏ Ngọc",
    gender: "Nữ",
    region: "Miền Trung",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaGwnIXXR48eXfrQA9mZeY6rMsZjyuN9T7MGTu5Im4NzWi64a4GZQN1EsMzcZlgMBG26-LoKRyEU2cPPx2WkfcsZR7Fjy4_zrIeUVep5pyqPSMh9G9Z-n-doLEHbMz0O1N2XyrMqYw0lKXroGsxDIbR7X6c8PKSAH5iTUJ8O353qMr7eOaenJ-QLCXNovRmaq6YcQyZl9orR7NlpOpYKWeOWOyjrfGEAXc_KHDMNU6p8jvl_DWwaS1NFICIO1toUv7p2l8L6F5oJir"
  }
];

export const VIDEO_SHOWCASES = [
  {
    id: "sh1",
    title: "Chuyện chú Hổ con biết lỗi",
    category: "Cổ tích",
    tagColor: "bg-[#dba110]",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArdJBuswZpDlxjemsFlvboGQtymgJ3Eu-MmHzxqoW5PAEqWHhmKriHsR9mEIlVJ7xXuuLSGTJTeRop2uO0vhngkqJDbsiKr48j0wf7hGEeOEzL4lNmTP7wtKlWiu_6HhWnYBmcZtedY9S4QydfvENSGwbMa5CrxAw_75amStIBuka-6psZ5MkYekobFfv01SwIO_ZSCe7RhFzVHXeRcAesKptsLaGNgrBLl8ADbG-Mmvnm_Ah5r6yLL8f12dTbaiWsq9EHq_Xs_Ar6"
  },
  {
    id: "sh2",
    title: "Bí mật dưới đại dương",
    category: "Khoa học",
    tagColor: "bg-[#004a77]",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5dfePmJE12_r7l3-u4eEazQJQY-FxxHQ6j8jQZF8mVI7vWlAbPiaPT5dyzNIKs3esKlqLm7ihbF3_D9HWZ1hE_aoewcJZu_O4duGKFQxHldIWBE1n2u7n2tpTkEtAhm5Qzbuo6dlo9TMoxQY2W3aMS-1sjLEu2frckscwBwfEI9fXbSc8vV8OsOJnXjHeFVyBLnbS5ePpZSMHkzxOqNbg2IPyIYRC0YlU3DrKxifJPw_1UjMoW2yYm19coYPJ9m9rxDEifALokYkp"
  },
  {
    id: "sh3",
    title: "Học hát cùng Chị Hằng",
    category: "Âm nhạc",
    tagColor: "bg-[#6bbf3a]",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-Nx_Vb3r_MOjZzmJpCUKy2DknQn9VPiQ3Bym1Ei_ECpl2rTdQhwmpcUoF7ztT0eUOJaL80Y4cKQ_P6o5N9U8VLm7_YIB6Cq1Ls20505Qd6klOHVS3NaPAYTnEWCAhZJ41FcQq4bav-fNYHxsZHY1h7RXqJhPk67IKaA_XUYZRrr4akh5bQLc9lLFmNB3hxvXz2wvLQzoJQDpO7iiguTVzCfyAtSJWZK1WFl8xA1yZuwZdrmbnyjK-mVz9RItYd2SGYQGAktip1S89"
  },
  {
    id: "sh4",
    title: "Bữa ăn đầy màu sắc",
    category: "Kỹ năng sống",
    tagColor: "bg-[#F48FB1]",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5mOsBNCRmhm5VLX-c5R_UG8y1xWuQezNudSxp5XtmXsJbpN-3WCLGrbWbEaqAgd9IjPL_5ufKIwasYnUXQPT_AhVeEB--SmHprtq1BOAPYGgBZ1m2mwhneHwoIiZvMxm30SIGfRJr-1Xca6DmJlW2rszoNl_hT5F3ZF0hdDx9rNalIdhn82yFuq-bsY6GB7wltFi90zT3DAkWu0w65Ot6Qs5M3thoaSKdgyEZSo_-R12uuXYrCmYLkHfkWDeTVIxHE4TRcjJIPQP5"
  },
  {
    id: "sh5",
    title: "Mùa đông ấm áp",
    category: "Mùa đông",
    tagColor: "bg-[#98cbff]",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3v07IuReyLxc6Jx27Fm-BOuweUR1L8GGGblkxXgNAaYiTI18gtUsVizl1e-zJO2H-RAHZX__JImi19Suo8_nJV_MTvNdoOFSUroutfonvGqeyDCCTjWqcWQ3IQG7wWkp0QYeOxbLFHn5p-srsPS-cxGO8NJbJSFUt_EbzHNNdI01HChwz3o1t-ZNAXiPn3J5ZkD0pztGEj7ItDDOJ6gDXnJmgEr4h6lxpwzwpkf1cy319rhhL-zbJyoJ_qFM9EQNodGuPBsZPfdSO"
  },
  {
    id: "sh6",
    title: "Vương quốc trên mây",
    category: "Ước mơ",
    tagColor: "bg-[#ffdea5]",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIRztmKqIs_NBv7ycEN9yrFX5d2k8FY1yh4O9yTkMlD_ovpeCJB1uuhSLdNLQpTIPuGyalfqkKgUH0fgvIdHaPIJAbOqRUs-4CQ9UpenZhNEVPO-uj8jOaDpKlWPMzAZLnjSmuqK5XaThIHhz2AU4mKiLKo-sQQHYwO0VqCTaZsO-MF6kregl2uUIBIBn5wbA-I46cBe_6hWZ6PD5NibSa5vA2dMZyob7DX0AlBCBShzTzSK3cN-13wKdsSjB0v3ajRSh4C0anfkfv"
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Chuyến phiêu lưu của Thỏ Bông",
    date: "12/10/2023",
    duration: "02:45",
    style: "Anime",
    prompt: "Một chú thỏ hồng thắt nơ xanh lục đi dạo trong khu vườn cổ tích có nấm phát sáng kỳ diệu ban đêm.",
    aspectRatio: "16:9",
    status: "completed",
    progress: 100,
    voiceId: "bena",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA53ADPeR5o00sLb2YY4J156V3F4c0kmkrEFjQtOj-paBlEirZ-c5eUNn3WdoDCUpRqungAk63GWJAqJoeKSfQn2B8JDz3reLUNoLYjWQykwLSAHC_aNBh301eeL3ZtRVWqP9RbZUixunuSmN5HBuh2wFX0sJo7SfMT1DBjatmZN0--inLC7exrmHcA1QR_-wOR2Ge48KbMX7OiAuwESh4ndiQA3jvnEKFhumyEXDBg7UnE61RWutTxllMr7k-mDUp8FWol2fUHOZOp",
    expirationDaysLeft: 5
  },
  {
    id: "v2",
    title: "Hành trình đến các vì sao",
    date: "10/10/2023",
    duration: "01:30",
    style: "3D Clay",
    prompt: "Bài giảng thiên văn dễ thương cho bé về thái dương hệ với mặt trời cười tươi rạng rỡ và các hành tinh tròn trịa.",
    aspectRatio: "16:9",
    status: "completed",
    progress: 100,
    voiceId: "ongcu",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEPtWSo3PZokhzmg7-Mr9a7ORRcLJpDGVhpslX8WWdYeWqmCPhgyvbOI2gF2pSvWl0n6ZSCBzo3_lqxofVwNvNleW1_AVoRW-dtXj9YPoQbx4vpCYLWGm6XzrD-k26CjPrQ5QO0Aq3kISrNNXmI6SF-cZ9iVs8y4BpaashaDkAbyrvtWs8SF48xYocfs4q26Y9VUCNMc4lj03Ilk-OOyDQ7CwiYG_Y82jgYK_ctIt1hoBLQByrq59220xQz9UeY4UIExjMz_sMxgqk",
    expirationDaysLeft: 2
  },
  {
    id: "v3",
    title: "Đại nhạc hội Rừng Xanh",
    date: "09/10/2023",
    duration: "03:12",
    style: "Ghibli",
    prompt: "Các bạn muông thú gấu nhỏ, cáo con chơi nhạc cụ bộ gõ trên cây nấm khổng lồ dưới ánh hoàng hôn rừng ấm áp.",
    aspectRatio: "16:9",
    status: "completed",
    progress: 100,
    voiceId: "chithongoc",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4mtS76MHaGa6ibaP-O_ubRfBkw6CA0TOkSNfWlA00_uo0Nrp8aQKCYDms_CuEcBBqPTitlSUjJkY-6XCz6zfKi1st4NGbt9DP4gFcEVDxAVcWQk0yOFbStgD4NfHaB_TRLXGUN-xRhIWhvqf1HDl8OiILt162vScIgd3kcvIKHgGmdHt8EDantkoueRdF8NEDGM1MX5cfyYPpXxexARCkaf9GAO9V-ZiiBbs3x3rn0VTk7iEqNsjC24H6FoJz-A_LS-Vn8E_mQnXQ",
    expirationDaysLeft: 1
  }
];

export const TEMPLATES: VideoTemplate[] = [
  {
    id: "t1",
    name: "Chú Cáo Nhỏ và Khu Rừng Bí Mật",
    ageTag: "3-5 Tuổi",
    durationTag: "2 Phút",
    description: "Mẫu video kể chuyện tương tác giúp bé phát triển vốn từ vựng và tư duy logic lành mạnh.",
    category: "Cổ tích",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD-httFt3Y4czd7wxLdAhzRxEB6cbysAUv_hiWKXvWssBH3V42L4Cb75IgLhn8MSMv9Am1HpwAnbbEXss_iPICPxx4mDkc8fsBjut9DdTysmEIcEqSJM2jBti8LojYGWLln_K8v4zP8LUhD_hmwwfTRyDYRokJX1qiCDgplLFJw45BvDZtSTaf71jKKkmnQFpN8Sv7v_jiqco6RfY0Y_Y4AKRjwjH4dUnMOKWVX0vqs9ObGg3t3GOcrcdSl8tcLECnDBSTunBw8hmo",
    isPopular: true
  },
  {
    id: "t2",
    name: "Thám Hiểm Hệ Mặt Trời",
    ageTag: "6-8 Tuổi",
    durationTag: "5 Phút",
    description: "Cùng phi hành gia thông thái bay vào vũ trụ bao la để tìm hiểu về hành tinh kỳ thú.",
    category: "Khoa học",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoARGycOIi9PexvXMxg27JeNbFcMJSJdJcau3sGAFdL5N9qOYyOXRaBQG-3k8JiFIbxIykxEBt05Y8bjLdUlxiLWBwJVEto1UVL_k4h-aWAP5Y1dc8piVnxMa7UZhEPG_YOBEAJ8B5ssw88CZe4zoxU6yAOTEqM_HevL52zY0cEg9Y1xUjwtJMviTl_Ls-DILxMOeryMNPRyKeQ1AIbQEc8Jh_H6DCtjakTPTLqmH8SV6p991_Gee-kJD7wuySBeBLklIbnGk3uUOW",
    isNew: true
  },
  {
    id: "t3",
    name: "Học Tiếng Anh Qua Bài Hát",
    ageTag: "4-7 Tuổi",
    durationTag: "3 Phút",
    description: "Giai điệu vui tươi kết hợp hình ảnh chuyển động mượt mà giúp bé thuộc từ vựng siêu nhanh.",
    category: "Âm nhạc",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1fTjELJbqonjgI5jCCtaXYbxx9l--ISyuPNBblANratpw8le9UdVCsDnBwtUewwrNNXmIl-UbhJ_ySrw8Ebnsr9SLS9Pz6q7ujapj9B8zRa0Rp5PJep9c7dsDO1MVGf_20AchhbSZNgxqhzLS4-K8TvqoiAoNNy6rntQsuVA5mvOou6rBZxxiStwBrbcJIwhDESX5IMdfSlkIKrtlFWQvvZ9XVihp1pdPWf80ZQLyOMfbQrFZDcxlWGc7qU3lhEcCzyaf34OljviF",
    isPopular: true
  },
  {
    id: "t4",
    name: "Thí Nghiệm Núi Lửa Vui Nhộn",
    ageTag: "7-10 Tuổi",
    durationTag: "8 Phút",
    description: "Hướng dẫn bé tự làm các thí nghiệm khoa học nho nhỏ an toàn, dễ thành công ngay tại nhà.",
    category: "Khoa học",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi_a6YmM5v6XbKwJrWn5tXn03iLtAnGj0ulqhCKzz5iGm9E38GqSvTyB9G6cX4R1F8cKXLU3ryBtAvzf-HqrVPbOm6IMjNQrV08wszSrGUJxKGDvMJpeTQ1JdX2JnxXKPEQZbumqohNh0Q1e4VKm5CpmLQRS9Qi2ibEknURYpDerQzOmV5lh9uleSUT2xt-qkje28De8wFVnmk59VYJu-Pb7aY8DUjo2DO2XTozCjSCPxOb8b26DI6QcgwjEvUBkURLL_Ho4KTumjD",
    isNew: true
  },
  {
    id: "t5",
    name: "Bé Làm Quen Với Bảng Chữ Cái",
    ageTag: "2-4 Tuổi",
    durationTag: "1 Phút",
    description: "Video ngắn trực quan, sinh động với hoạt họa bảng chữ di động dễ mến thân thiện.",
    category: "Bài học",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYeIieV2q1655SUL6hdwPwoKstWHzzVzJljxiNmeTInWO9DnGyR5-8ZnfqUMlr446wr7HnGIEFlAYUYRYGEDHUUfSAhAr6sinOf5PMmUSV2QxTvQeuwMMr_NFDHE2crd67T1vqgXAMy73LKvaGSTjE2qU9xDHgZ6dkoRjs0hqgf4rgk4nlRZffYysoYA3WjbL7XyNvzx9xzKW4gnxTR7xJigEciim-qUPrP0ETpIVhZmuQ-2QREhsHz-Vd6dgJMaG3DeiAQBJASR5Q"
  },
  {
    id: "t6",
    name: "Hình Khối Vui Nhộn Cùng Bạn Voi",
    ageTag: "3-5 Tuổi",
    durationTag: "3 Phút",
    description: "Nhận diện hình vuông, tròn, tam giác thông qua các hình khối gỗ đồ chơi dễ thương.",
    category: "Bài học",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlajouVjZbytN40Km2ThyXoLmTURtQiv3Z4sUudoHeBCZwj96gEnrS1hGszJPQ8lmTAYcU_0vJ-KtRYJr7pG2_C1doHJiI9RK0or9Q0-COIHol30e9L2bf48OswP-4x_Q9uIeX9I6dMzfbHKblhFzMW3g12hhxSAwwzOuTA9ePQFNpr5FtwgVDTpLBgOlmIyl9iIV1pkP3GD89EWzxzfKXpZB9x8J2zyl81lfNpKbyhl7MZRNRFKtpL51lbP8TNCnO2XyAXWB4X04x"
  }
];

export const INITIAL_NODES: WorkflowNode[] = [
  {
    id: "n-script",
    type: "script",
    label: "Kịch bản",
    icon: "sparkles",
    colorClass: "bg-[#6bbf3a] text-white",
    bgColorClass: "bg-[#6bbf3a]/10",
    borderColorClass: "border-[#6bbf3a]",
    details: "Tạo kịch bản truyện..."
  },
  {
    id: "n-scene-character",
    type: "scene-character",
    label: "Cảnh & Nhân vật",
    icon: "landscape",
    colorClass: "bg-[#4bafff] text-white",
    bgColorClass: "bg-[#4bafff]/10",
    borderColorClass: "border-[#4bafff]",
    details: "Bối cảnh & Mascot..."
  },
  {
    id: "n-voice",
    type: "voice",
    label: "Tạo Voice",
    icon: "mic",
    colorClass: "bg-[#C792E0] text-white",
    bgColorClass: "bg-[#C792E0]/15",
    borderColorClass: "border-[#C792E0]",
    details: "Giọng đọc, ngữ điệu..."
  },
  {
    id: "n-video",
    type: "video",
    label: "Tạo Video",
    icon: "view_carousel",
    colorClass: "bg-[#FF9F40] text-white",
    bgColorClass: "bg-[#FF9F40]/15",
    borderColorClass: "border-[#FF9F40]",
    details: "Ghép khớp slide phim..."
  },
  {
    id: "n-export",
    type: "export",
    label: "Xuất video",
    icon: "video_file",
    colorClass: "bg-[#dba110] text-white",
    bgColorClass: "bg-[#dba110]/15",
    borderColorClass: "border-[#dba110]",
    details: "Tải MP4 FullHD..."
  }
];
