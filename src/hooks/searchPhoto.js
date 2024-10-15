// import { useQuery } from "@tanstack/react-query";
// import api from "../utils/api";

// const fetchSearchPhoto = ({ country }) => {
//     return country
//         ? api.get(`/photo?country=${country}`)
//         : api.get("/photo");
// }

// export const useSearchPhotoQuery = (country) => {
//     return useQuery({
//         queryKey: ['photo-search', country],
//         queryFn: () => fetchSearchPhoto({ country }),
//     });
// }
