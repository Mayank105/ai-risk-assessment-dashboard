import * as tf from '@tensorflow/tfjs';
import { SecurityData } from '../types';

export class SecurityAIModel {
  private model: tf.LayersModel | null = null;

  async initialize() {
    // Create a sequential model
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [7], units: 14, activation: 'relu' }),
        tf.layers.dense({ units: 7, activation: 'relu' }),
        tf.layers.dense({ units: 3, activation: 'softmax' })
      ]
    });

    // Compile the model
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  private preprocessData(data: SecurityData): number[] {
    return [
      data['Firewall Enabled'],
      data['Encryption Used'],
      data['Admin Accounts'],
      data['Unpatched Vulnerabilities'] / 10, // Normalize
      data['Remote Access Allowed'],
      data['Antivirus Installed'],
      data['Security Audit Completed']
    ];
  }

  async predict(data: SecurityData): Promise<string> {
    if (!this.model) {
      await this.initialize();
    }

    const input = this.preprocessData(data);
    const prediction = await this.model!.predict(
      tf.tensor2d([input])
    ) as tf.Tensor;
    
    const probabilities = await prediction.data();
    const riskLevels = ['Low', 'Medium', 'High'];
    const maxIndex = probabilities.indexOf(Math.max(...Array.from(probabilities)));
    
    return riskLevels[maxIndex];
  }
}

export const aiModel = new SecurityAIModel();