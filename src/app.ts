import axios from 'axios';
import { Loader } from "@googlemaps/js-api-loader";

// DEMO KEY - use your key
const GOOGLE_API_KEY = 'AIzaSyBCbm10VF7wmTPehN884pLIEdnGRENj-ik';

const loader = new Loader({
  apiKey: GOOGLE_API_KEY,
  version: "weekly",
  libraries: ['maps', 'marker']
});

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;


type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number, lng: number } } }[],
  status: 'OK' | 'ZERO_RESULTS'
}

let map;

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // send this to Googles's API!
  axios
    .get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
    .then(async (response) => {
      if (response.data.status !== 'OK') {
        throw new Error('Could not fetch location!')
      }
      const coordinates = response.data.results[0].geometry.location;

      const {maps} = await loader.load();
      const {Map, Marker} = maps;
      map = new Map(document.getElementById("map") as HTMLElement, {
        center: coordinates,
        zoom: 16,
      });


      const marker = new Marker({
        map: map,
        position: coordinates,
        title: enteredAddress
      });

      console.log(marker)
    })
    .catch((err) => {
      alert(err.message)
      console.log(err)
    })
}

form.addEventListener('submit', searchAddressHandler);