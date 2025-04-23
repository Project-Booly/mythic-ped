export const fetchNui = (eventName, data = {}) => {
  return new Promise((resolve, reject) => {
      fetch(`https://mythic-ped/${eventName}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};
