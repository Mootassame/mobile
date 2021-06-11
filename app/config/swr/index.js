// import axios from 'axios'
// import useSWR from 'swr'
// import Config from 'react-native-config'

// export default function useRequest (request, config) {
//   const defaultConfig = {
//   }

//   const defaultRequest = {
//     baseURL: Config.API_URL,
//     timeout: parseInt(Config.REQUEST_TIMEOUT)
//   }

//   // axios.interceptors.request.use(
//   //   (response) => {
//   //     console.log(' response == ', response);
//   //     return response;
//   //   },
//   //   (error) => {
//   //     console.log(' error == ', error);
//   //   },
//   // );

//   // axios.interceptors.response.use(
//   //   (response) => {
//   //     console.log(' response == ', response);
//   //     return response;
//   //   },
//   //   (error) => {
//   //     console.log(' error == ', error);
//   //   },
//   // );

//   // console.log('request  ===== ', { ...defaultRequest, ...request })

//   // console.log('config =====', { ...defaultConfig, ...config })

//   const { data: response, error, isValidating, revalidate } = useSWR(
//     JSON.stringify(request.url),

//     () =>
//       axios({
//         ...defaultRequest,
//         ...request
//       }),
//     { ...defaultConfig, ...config }
//   )

//   return {
//     data: response && response.data,
//     response,
//     error,
//     isValidating,
//     revalidate
//   }
// }

// // Example "use it inside component"
// // const { data ,
// //   response,
// //   error,
// //   isValidating} = useRequest({
// //   method: 'GET',
// //   url: '/884149f2-29df-4311-aa91-861dc37f3485',
// // },{refreshInterval: 0});

// // console.log("data == ",data);
// // //console.log("response ==",response);
// // //console.log("error ==",error);
// // console.log("isValidating ==",isValidating);
