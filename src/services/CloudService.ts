import {CloudService} from "../studentcher-shared-utils/services/CloudService";
import cloudStorageAdapter from "../storage/CloudStorageAdapter";

export default new CloudService(cloudStorageAdapter);
