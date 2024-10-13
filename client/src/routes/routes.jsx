import HomePage from "@/pages/home/HomePage";

export const routesGen = {
  home: "/",
  mediaList: (type) => `/${type}`,
  mediaDetail: (type, id) => `/${type}/${id}`,
  mediaSearch: "/search",
  person: (id) => `/person/${id}`,
  favoriteList: "favorites",
  reviewList: "reviews",
  passwordUpdate: "password-update",
};

const routes = [
  {
    index: true,
    element: <HomePage />,
    state: "home",
  },
];

export default routes;
