import axios from 'axios';

export default axios.create({
    baseURL: `https://us-central1-get-voice-4d167.cloudfunctions.net/api/v1`,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
});