import { Colors } from '@/constants/Colors';
import { userTypeSelector } from '@/redux/selector';

const userAppColor = () => {
  const userType = userTypeSelector();
  const color = userType === 'user' ? Colors.orange : Colors.blue;
  return color;
};

export { userAppColor };
