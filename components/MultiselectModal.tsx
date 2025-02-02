import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from 'react-native';
import RNModal from './RNModal';
import RadioOpion from './RadioOpion';
import { Colors } from '@/constants/Colors';
import { horizontalScale, verticalScale } from '@/utils/matrix';
import Button from './Button';

type MultiselectModalProps = {
  visible: boolean;
  onClose: () => void;
  list: any[];
  value: any[];
  onSubmit: (selected: any[]) => void;
};

const MultiselectModal = ({
  visible,
  onClose,
  list,
  value,
  onSubmit,
}: MultiselectModalProps) => {
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    setSelected(value);
  }, [visible]);

  /**
   * Handles the selection of an item. If the item is not already selected, it adds the item's id to the selected list.
   * If the item is already selected, it removes the item's id from the selected list.
   *
   * @param {any} item - The item to be selected or deselected. The item is expected to have an `id` property.
   */
  const onSelect = (item: any) => {
    const index = selected.findIndex(i => i === item.id);
    if (index === -1) {
      setSelected([...selected, item.id]);
    } else {
      setSelected(selected.filter(i => i !== item.id));
    }
  };

  /**
   * Handles the cancel button press event.
   * Clears the selected items and closes the modal.
   */
  const onCancelPress = () => {
    setSelected([]);
    onClose();
  };

  /**
   * Handles the submit button press event.
   * Calls the `onSubmit` function with the selected items and then closes the modal.
   */
  const onSubmitPress = () => {
    onSubmit(selected);
    onClose();
  };

  return (
    <RNModal visible={visible} onClose={onClose}>
      <TouchableWithoutFeedback>
        <View style={styles.listContainer}>
          <ScrollView>
            {list.map((item: any, index: number) => (
              <RadioOpion
                key={index}
                label={item.name}
                onSelect={() => onSelect(item)}
                isSelected={selected.some(i => i === item.id)}
                isMultiple={true}
              />
            ))}
          </ScrollView>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              title="Cancel"
              style={{ backgroundColor: Colors.lightBlue, width: '45%' }}
              titleStyle={{ color: Colors.blue }}
              onPress={onCancelPress}
            />
            <Button
              title="Submit"
              style={{ width: '45%' }}
              onPress={onSubmitPress}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: horizontalScale(7),
    borderTopRightRadius: horizontalScale(7),
    padding: horizontalScale(25),
    maxHeight: verticalScale(500),
  },
});

export default MultiselectModal;
