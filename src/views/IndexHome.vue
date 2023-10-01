<template>
    <div class="container col-xxl-10 px-3 py-3">
        <div class="row flex-lg-row-reverse align-items-center g-4 py-2">
            <div class="col-10 col-sm-8 col-lg-6">
                <img src="../assets/images/hero.png" class="d-block mx-lg-auto img-fluid animated" width="500" height="700"
                    alt="">
            </div>
            <div class="col-lg-6">
                <div data-aos="fade-left" data-aos-duration="3000">
                    <h1 class="display-5 fw-bold lh-1 mb-3">
                        <span class="border-top border-5 border-primary text-primary">EXPLORE</span> <span
                            class="text-light">
                            COURIER DELIVERY
                        </span>
                    </h1>
                    <p class="lead text-light">
                        Connecting People. <br>
                        Improving Lives.
                    </p>
                    <Form :validation-schema="schema" v-slot="{ errors }" @submit="search">
                        <div class="d-grip gap-2 d-md-flex justify-content-md-start">
                            <Field type="text" class="form-control" placeholder="resi number" name="kode" v-model="kode" />
                            <button type="submit" class="btn btn-sm btn-warning px-4 me-md-2 text-light"
                                :disabled="isLoading">
                                <div class="d-grip gap-2 d-md-flex justify-content-md-start">
                                    <b>{{ isLoading ? 'Loading' : 'Tracking' }}</b>
                                    <LoadingComponent class="mt-1" v-if="isLoading" />
                                </div>
                            </button>
                        </div>
                        <p>
                            <span class="text-danger">
                                {{ errors.kode }}
                            </span>
                        </p>
                    </Form>
                </div>
            </div>
        </div>
        <div class="row flex-lg-row-reverse align-items-center g-4 py-2">
            <div class="col-10 col-sm-8 col-lg-6">
                <div data-aos="fade-left" class="mt-4" data-aos-duration="3000">
                    <h3 class="fw-bold lh-1 mb-3">
                        <span class="text-light">
                            Detail Delivery
                        </span>
                    </h3>
                    <div class="card shadow">
                        <div class="card-header">
                            <div class="card-title">
                                <h5>Data Penerima</h5>
                            </div>
                        </div>
                        <div class="card-body">
                            <!-- menampilkan detail paket -->
                            <div class="table table-responsive">
                                <table class="table">
                                    <thead>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Alamat</th>
                                    </thead>
                                    <tbody>
                                        <td>
                                            {{ user.nama }}
                                        </td>
                                        <td>
                                            {{ user.email }}
                                        </td>
                                        <td>
                                            {{ user.alamat }}
                                        </td>
                                    </tbody>
                                </table>
                            </div>
                            <h5>Data Paket</h5>
                            <hr>
                            <div class="table table-responsive">
                                <table class="table">
                                    <thead>
                                        <th>Nama Barang</th>
                                        <th>Berat</th>
                                        <th>Harga</th>
                                    </thead>
                                    <tbody>
                                        <td>
                                            {{ barang.namaBarang }}
                                        </td>
                                        <td>
                                            {{ barang.berat }}
                                        </td>
                                        <td>
                                            {{ barang.harga }}
                                        </td>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <h3 class="fw-bold mb-3">
                    <span class="text-light">
                        Current Location
                    </span>
                </h3>
                <div class="card shadow">
                    <div class="card-body">
                        <!-- pengecekan latitude dan longitude -->
                        <template v-if="latitude !== null && longitude !== null">
                            <!-- menampilkan map -->
                            <l-map style="height: 300px" :zoom="zoom" :center="[latitude, longitude]">
                                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                                <!-- menampilkan lokasi keberadaan kita -->
                                <l-marker :lat-lng="[latitude, longitude]">
                                    <l-popup :options="popupOptions">
                                        {{ locationName ? locationName.display_name : '' }}
                                    </l-popup>
                                </l-marker>
                                <!-- membuat garis rute berdasarkan data yang ada -->
                                <l-polyline v-if="routeCoordinates.length > 0" :lat-lngs="routeCoordinates"
                                    :color="'green'" />
                                <!-- melakukan perulangan data untuk menghasilkan marker -->
                                <template v-for="data in dataShip">
                                    <l-marker :lat-lng="[data.latitude, data.longitude]" :icon="getMarkerIcon(data.status)">
                                        <l-popup>
                                            {{ data.status }} | {{ data.deskripsi }} | {{ data.tanggal }}
                                        </l-popup>
                                    </l-marker>
                                </template>
                            </l-map>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import marker untuk icon di map
import shipMarker from '../assets/images/shipMarker.png'
import homeMarker from '../assets/images/home.png'
import gudangMarker from '../assets/images/gudang.png'
import LoadingComponent from '../components/loading/LoadingComponent.vue'
import axios from 'axios'

// atribut leaflet
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";

// atribut validasi form
import { Form, Field } from 'vee-validate'
import * as valid from 'yup'
export default {
    data() {
        return {
            // dummy data dari seeder untuk mencari paket
            kode: "TRX-2003077",
            // atribut leaflet
            routeCoordinates: [],
            dataShip: [],
            user: {},
            barang: {},
            isLoading: false,
            shipIcon: null,
            homeIcon: null,
            gudangIcon: null,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> digireg',
            zoom: 10,
            latitude: null,
            longitude: null,
            locationName: null,
            popupOptions: {
                maxWidth: 200,
            },
        }
    },
    computed: {
        // untuk validasi form yang tidak boleh kosong.
        schema() {
            return valid.object({
                kode: valid.string().required('resi number must be field')
            })
        }
    },
    mounted() {
        this.getCurrentLocation();
        this.customIcon()
    },
    created() {
        this.createRoute();
    },
    components: {
        LoadingComponent, Form, Field, LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LPolyline
    },
    methods: {
        // membuat kondisi perubahan icon menggunakan status
        getMarkerIcon(status) {
            if (status === 'ON DELIVERY') {
                return this.shipIcon;
            } else if(status === "SHIPMENT") {
                return this.gudangIcon; 
            } else {
                return this.homeIcon; 
            }
        },
        // method untuk mengambil data paket dengan tipe post
        search() {
            this.isLoading = true;
            let type = 'postData';
            let url = ['tracking', { kode: this.kode }];
            this.$store.dispatch(type, url)
                .then((result) => {
                    this.dataShip = result.data
                    this.user = result.user
                    this.barang = result.barang
                    // pemanggilan rute atau pembuatan rute
                    this.createRoute();
                }).finally(() => {
                    // kondisi loading akan false ketika data ditemukan.
                    this.isLoading = false;
                });
        },
        // method untuk mendapatkan lokasi keberadaan kita
        getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        this.latitude = position.coords.latitude;
                        this.longitude = position.coords.longitude;
                        this.fetchLocationDetails();
                    },
                    error => {
                        console.error('Error occurred while retrieving current location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        },
        // method untuk membuat rute tracking berdasarkan data dari api
        createRoute() {
            this.routeCoordinates = this.dataShip.map((data) => [data.latitude, data.longitude]);
            console.log(this.routeCoordinates);
        },
        // mengambil nama lokasi
        fetchLocationDetails(latitude, longitude) {
            axios
                .get('https://nominatim.openstreetmap.org/reverse', {
                    params: {
                        lat: this.latitude,
                        lon: this.longitude,
                        format: 'jsonv2',
                    },
                })
                .then(response => {
                    this.locationName = response.data;
                })
                .catch(error => {
                    console.error('Error occurred while fetching location details:', error);
                });
        },
        // kustomisasi icon
        customIcon() {
            this.shipIcon = L.icon({
                iconUrl: shipMarker,
                iconSize: [40, 45]
            })
            this.homeIcon = L.icon({
                iconUrl: homeMarker,
                iconSize: [40, 45]
            })
            this.gudangIcon = L.icon({
                iconUrl: gudangMarker,
                iconSize: [40, 45]
            })
        }
    }
}
</script>