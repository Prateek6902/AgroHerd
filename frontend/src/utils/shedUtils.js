// utils/shedUtils.js
import axios from 'axios';

/**
 * Get available sheds for given animal type with space left
 * @param {string} animalType - e.g., 'cow'
 * @returns {Promise<{ status: string, sheds?: Array }>}
 */
export async function getAvailableSheds(animalType) {
  const token = localStorage.getItem('token');
  try {
    // 1. Fetch all sheds for the farmer
    const shedRes = await axios.get('http://localhost:5000/api/sheds', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allSheds = shedRes.data.filter(
      (shed) => shed.animal.toLowerCase() === animalType.toLowerCase()
    );

    if (allSheds.length === 0) {
      return { status: 'No shed detected' };
    }

    // 2. Fetch all animals to calculate current shed load
    const animalRes = await axios.get('http://localhost:5000/api/animals', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allAnimals = animalRes.data.filter((a) => a.type === animalType);

    // 3. Build mapping of shed ID to current count
    const shedAnimalCount = {};
    allAnimals.forEach((a) => {
      if (a.shed) {
        shedAnimalCount[a.shed] = (shedAnimalCount[a.shed] || 0) + a.count;
      }
    });

    // 4. Filter sheds with available capacity
    const availableSheds = allSheds.filter((shed) => {
      const used = shedAnimalCount[shed._id] || 0;
      return used < shed.capacity;
    });

    if (availableSheds.length === 0) {
      return { status: 'No shed detected' };
    }

    // 5. Return list of available sheds
    return {
      status: 'Available',
      sheds: availableSheds.map((shed) => ({
        ...shed,
        used: shedAnimalCount[shed._id] || 0,
        remaining: shed.capacity - (shedAnimalCount[shed._id] || 0),
      })),
    };
  } catch (err) {
    console.error('Error fetching sheds or animals:', err);
    return { status: 'Error', message: 'Failed to fetch shed info' };
  }
}
