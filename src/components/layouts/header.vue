<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" aria-label="Ninth navbar example">
        <div class="container-xl">
            <NavbarBrand Name="Tracking Places"/>
            <div class="collapse navbar-collapse" id="navbarsExample07XL">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <NavigationItem>
                        <template #list>
                            <router-link to="/" class="nav-link">
                                Shipping
                            </router-link>
                        </template>
                    </NavigationItem>
                    <NavigationItem>
                        <template #list>
                            <router-link to="/" class="nav-link">
                                Tracking
                            </router-link>
                        </template>
                    </NavigationItem>
                    <NavigationItem>
                        <template #list>
                            <router-link to="/" class="nav-link">
                                Design & Pint
                            </router-link>
                        </template>
                    </NavigationItem>
                    <NavigationItem>
                        <template #list>
                            <router-link to="/" class="nav-link">
                                Locations
                            </router-link>
                        </template>
                    </NavigationItem>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script setup>
import NavbarBrand from '../partial-navbar-components/NavbarBrand.vue';
import NavigationItem from '../partial-navbar-components/NavigationItem.vue';
</script>