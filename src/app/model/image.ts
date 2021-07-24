export interface Image {
  image_id: number;
  name: String;
  imageBytes: File;
  userId?: number;
  messageId?: number;
}
