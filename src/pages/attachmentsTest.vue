<script setup>
import { ref } from 'vue';

const items = ref([
  {
    id: 0,
    name: 'Patsy Smith',
  },
  {
    id: 1,
    name: 'Harriet Munoz',
  },
  {
    id: 2,
    name: 'Deleon Savage',
  },
  {
    id: 3,
    name: 'Hampton Callahan',
  },
  {
    id: 4,
    name: 'Avery Barnes',
  },
  {
    id: 5,
    name: 'Munoz George',
  },
  {
    id: 6,
    name: 'Gallegos Jordan',
  },
  {
    id: 7,
    name: 'Bianca Castillo',
  },
  {
    id: 8,
    name: 'Rachael Freeman',
  },
  {
    id: 9,
    name: 'Hughes Newman',
  },
  {
    id: 10,
    name: 'Wade Johnson',
  },
  {
    id: 11,
    name: 'Tyson Mendez',
  },
  {
    id: 12,
    name: 'Cunningham Boyer',
  },
  {
    id: 13,
    name: 'Flora Shannon',
  },
  {
    id: 14,
    name: 'Franklin Rowe',
  },
  {
    id: 15,
    name: 'Fry Francis',
  },
  {
    id: 16,
    name: 'Price Nielsen',
  },
  {
    id: 17,
    name: 'Stewart Jackson',
  },
  {
    id: 18,
    name: 'Heidi Bartlett',
  },
  {
    id: 19,
    name: 'Blanchard Watts',
  },
  {
    id: 20,
    name: 'Beck Faulkner',
  },
  {
    id: 21,
    name: 'Crawford Ewing',
  },
  {
    id: 22,
    name: 'Louella Riddle',
  },
  {
    id: 23,
    name: 'Hurst Rivera',
  },
  {
    id: 24,
    name: 'Kathryn Craig',
  },
  {
    id: 25,
    name: 'Mable Garrison',
  },
  {
    id: 26,
    name: 'Luz Figueroa',
  },
  {
    id: 27,
    name: 'Sherman Christian',
  },
  {
    id: 28,
    name: 'Wells Whitehead',
  },
  {
    id: 29,
    name: 'Caldwell Webster',
  },
  {
    id: 30,
    name: 'Deloris Holloway',
  },
  {
    id: 31,
    name: 'Gretchen Paul',
  },
  {
    id: 32,
    name: 'Walls Medina',
  },
  {
    id: 33,
    name: 'Esmeralda Duffy',
  },
  {
    id: 34,
    name: 'Mabel Keith',
  },
  {
    id: 35,
    name: 'Katrina Booker',
  },
  {
    id: 36,
    name: 'Amber Frost',
  },
  {
    id: 37,
    name: 'Matilda Gallagher',
  },
  {
    id: 38,
    name: 'Reed Schroeder',
  },
  {
    id: 39,
    name: 'Oneal Ward',
  },
  {
    id: 40,
    name: 'Castaneda Rose',
  },
  {
    id: 41,
    name: 'Pate Mack',
  },
  {
    id: 42,
    name: 'Gladys Thompson',
  },
  {
    id: 43,
    name: 'Frances Meyer',
  },
  {
    id: 44,
    name: 'Jeanne Carroll',
  },
  {
    id: 45,
    name: 'Marietta Buchanan',
  },
  {
    id: 46,
    name: 'Silva Townsend',
  },
  {
    id: 47,
    name: 'Mccarty Glover',
  },
  {
    id: 48,
    name: 'Celeste Albert',
  },
  {
    id: 49,
    name: 'Shaffer Mcbride',
  },
  {
    id: 50,
    name: 'Walter Donaldson',
  },
  {
    id: 51,
    name: 'Reilly Sanchez',
  },
  {
    id: 52,
    name: 'Juanita Duke',
  },
  {
    id: 53,
    name: 'Tasha Bowen',
  },
  {
    id: 54,
    name: 'Delores Beach',
  },
  {
    id: 55,
    name: 'Tommie Obrien',
  },
  {
    id: 56,
    name: 'Deana Robertson',
  },
  {
    id: 57,
    name: 'Aimee Rutledge',
  },
  {
    id: 58,
    name: 'Burris Cunningham',
  },
  {
    id: 59,
    name: 'Chase Fry',
  },
  {
    id: 60,
    name: 'Chasity Logan',
  },
  {
    id: 61,
    name: 'Stella Hammond',
  },
  {
    id: 62,
    name: 'Wheeler Campos',
  },
  {
    id: 63,
    name: 'Odonnell Solis',
  },
  {
    id: 64,
    name: 'Stark Roman',
  },
  {
    id: 65,
    name: 'Jerry Rodgers',
  },
  {
    id: 66,
    name: 'Sandra Burton',
  },
  {
    id: 67,
    name: 'Laverne Farrell',
  },
  {
    id: 68,
    name: 'Trevino Rasmussen',
  },
  {
    id: 69,
    name: 'Aurelia Weiss',
  },
  {
    id: 70,
    name: 'Hallie Sweeney',
  },
  {
    id: 71,
    name: 'Josefina Maxwell',
  },
  {
    id: 72,
    name: 'Stephanie Ellison',
  },
  {
    id: 73,
    name: 'Elise Garner',
  },
  {
    id: 74,
    name: 'Cleo Church',
  },
  {
    id: 75,
    name: 'Barber Zimmerman',
  },
  {
    id: 76,
    name: 'Cooley Marquez',
  },
  {
    id: 77,
    name: 'Cornelia Hoffman',
  },
  {
    id: 78,
    name: 'Lela Melendez',
  },
  {
    id: 79,
    name: 'Rodgers Watkins',
  },
  {
    id: 80,
    name: 'Carlson Peterson',
  },
  {
    id: 81,
    name: 'Zamora Lowery',
  },
  {
    id: 82,
    name: 'Emerson Hendrix',
  },
  {
    id: 83,
    name: 'Sharron Holman',
  },
  {
    id: 84,
    name: 'Torres Banks',
  },
  {
    id: 85,
    name: 'Daniel Carpenter',
  },
  {
    id: 86,
    name: 'Bernadine Cantrell',
  },
  {
    id: 87,
    name: 'Kenya Galloway',
  },
  {
    id: 88,
    name: 'Lana Leonard',
  },
  {
    id: 89,
    name: 'Logan Levine',
  },
  {
    id: 90,
    name: 'Trujillo Kline',
  },
  {
    id: 91,
    name: 'Elsie Bird',
  },
  {
    id: 92,
    name: 'Theresa Hewitt',
  },
  {
    id: 93,
    name: 'Sophie Marshall',
  },
  {
    id: 94,
    name: 'Jo Reyes',
  },
  {
    id: 95,
    name: 'Jan Baird',
  },
  {
    id: 96,
    name: 'Mann Johns',
  },
]);
// const fakeData = ref([]);
const position = ref('bottom');
const currentPage = ref(1);
const perPage = ref(50);
const totalItems = ref(100); // Adjust total items as needed

const loadMoreData = () => {
  if (items.value.length >= totalItems.value) {
    return; // No more data to load
  }

  currentPage.value++;

  // Replace with your actual API call or fake data generation
  const fakeData = Array.from({ length: perPage.value }, (_, index) => ({
    id: index + items.value.length + 1,
    title: `Item ${index + items.value.length + 1}`,
  }));

  items.value.push(...fakeData);
};
</script>

<template>
  <div class="infinite-scroll-container">
    <q-infinite-scroll @load-more="loadMoreData" :position="position">
      <q-list>
        <q-item-label v-for="item in items" :key="item.id">{{
          item.title
        }}</q-item-label>
      </q-list>
    </q-infinite-scroll>
  </div>
</template>
