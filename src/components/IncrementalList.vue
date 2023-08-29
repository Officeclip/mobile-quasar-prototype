<template>
    <q-layout>
    <q-page-container>
      <q-page>
        <h4>Incremental List</h4>
          <q-list>
            <q-item v-for="item in items" :key="item.id">
              {{ item.title }}
            </q-item>
          </q-list>
      </q-page>

    <!-- <ul>
      <li v-for="item in items" :key="item.id">{{ item.title }}</li>
    </ul> -->
    <q-infinite-scroll @load="loadMore" :distance="100" :disable="reachedEnd">
      <template v-slot:loading>
        <div>Loading more...</div>
      </template>
    </q-infinite-scroll>
  </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const items = ref([]);
const currentPage = ref(1);
const reachedEnd = ref(false);

const loadMore = async () => {
  try {
    // Simulate an API call to fetch more data using JSONPlaceholder service
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${currentPage.value}&_limit=10`
    );
    const data = await response.json();

    // If there is no more data, disable infinite-scroll
    if (data.length === 0) {
      reachedEnd.value = true;
    } else {
      // Append the new data to the existing items
      items.value = [...items.value, ...data];
      currentPage.value++; // Increment page number after fetching data
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  // Initial data loading when the component is mounted
  loadMore();
});
</script>
