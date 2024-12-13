import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Fonts } from '@/constants/Fonts';
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { getDefaultHeaderHeight } from '@/utils/helper';
import { languageListSelector, specialityListSelector } from '@/redux/selector';

type FilterModalProps = {
  visible: boolean;
  onApplyFilter: (
    sort: string,
    skills: string[],
    language: string[],
    gender: string
  ) => void;
  onResetFilter: () => void;
};

const FilterModal = ({
  visible,
  onApplyFilter,
  onResetFilter,
}: FilterModalProps) => {
  const languages = languageListSelector();
  const speciality = specialityListSelector();
  const filterOptions: {
    title: string;
    id: string;
    options: any[];
    selectMultiple: boolean;
    selected: string | string[];
  }[] = [
    {
      title: 'Sort by',
      id: 'sort',
      options: [
        { id: '1', name: 'Popularity' },
        { id: '2', name: 'Experience: High to Low' },
        { id: '3', name: 'Experience: Low to High' },
        { id: '4', name: 'Price: High to Low' },
        { id: '5', name: 'Price: Low to High' },
      ],
      selectMultiple: false,
      selected: '',
    },
    {
      title: 'Skill',
      id: 'skills',
      options: speciality,
      selectMultiple: true,
      selected: [],
    },
    {
      title: 'Language',
      id: 'language',
      options: languages,
      selectMultiple: true,
      selected: [],
    },
    {
      title: 'Gender',
      id: 'gender',
      options: [
        { id: '1', name: 'Male' },
        { id: '2', name: 'Female' },
      ],
      selectMultiple: false,
      selected: '',
    },
  ];

  const [currentOption, setCurrentOption] = useState(0);
  const [options, setOptions] = useState(filterOptions);

  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  const statusBarHeight = insets.top;
  const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight);

  const onReset = () => {
    setOptions(
      options.map(option => ({
        ...option,
        selected: option.selectMultiple ? [] : '',
      }))
    );
    onResetFilter();
  };

  const onApply = () => {
    const sort = options[0].selected as string;
    const skills = options[1].selected as string[];
    const language = options[2].selected as string[];
    const gender = options[3].selected as string;
    onApplyFilter(sort, skills, language, gender);
  };

  const onChangeOption = (index: number) => {
    setCurrentOption(index);
  };

  const onSelect = (item: { id: string }) => {
    if (options[currentOption].selectMultiple) {
      const selected = options[currentOption].selected || [];
      if (selected.includes(item.id)) {
        const index = selected.indexOf(item.id);
        if (Array.isArray(selected)) {
          selected.splice(index, 1);
        }
      } else {
        if (Array.isArray(selected)) {
          selected.push(item.id);
        }
      }
      setOptions([...options]);
    } else {
      options[currentOption].selected = item.id;
      setOptions([...options]);
    }
  };

  const renderRadio = (option: { id: string; name: string }) => {
    if (options[currentOption].selectMultiple) {
      return (
        <SvgImage
          url={
            options[currentOption].selected.includes(option.id)
              ? Images.radioChecked
              : Images.radio
          }
          style={{
            height: verticalScale(20),
            width: verticalScale(20),
            marginRight: horizontalScale(10),
          }}
        />
      );
    }
    return (
      <SvgImage
        url={
          options[currentOption].selected.includes(option.id)
            ? Images.radioSelected
            : Images.radio
        }
        style={{
          height: verticalScale(20),
          width: verticalScale(20),
          marginRight: horizontalScale(10),
        }}
      />
    );
  };
  return (
    <Modal
      visible={visible}
      onRequestClose={onResetFilter}
      animationType="fade"
      statusBarTranslucent>
      <View
        style={{
          height: defaultHeight + 10,
          borderBottomWidth: 1,
          borderBottomColor: Colors.white1,
        }}>
        <View pointerEvents="none" style={{ height: statusBarHeight }} />
        <View style={styles.container}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.title}>Sort & Filter</Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: '35%', backgroundColor: Colors.white3 }}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onChangeOption(index)}
              style={{
                padding: horizontalScale(20),
                backgroundColor:
                  index == currentOption ? Colors.orange1 : Colors.white3,
              }}>
              <Text
                style={{
                  fontSize: moderateScale(12),
                  color: index == currentOption ? Colors.orange : Colors.black2,
                  fontFamily: Fonts.PoppinsMedium,
                }}>
                {option.title}
              </Text>
              {option.selected.length ? (
                <View
                  style={{
                    position: 'absolute',
                    right: horizontalScale(15),
                    top: verticalScale(30),
                    height: verticalScale(10),
                    width: verticalScale(10),
                    borderRadius: verticalScale(10),
                    backgroundColor: Colors.orange,
                  }}
                />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ width: '65%', backgroundColor: Colors.white }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options[currentOption].options.map((option, index) => (
              <TouchableOpacity
                onPress={() => onSelect(option)}
                key={index}
                style={{
                  paddingHorizontal: horizontalScale(20),
                  paddingVertical: horizontalScale(15),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {renderRadio(option)}
                <Text
                  style={{
                    fontSize: moderateScale(12),
                    color: Colors.black2,
                    fontFamily: Fonts.PoppinsMedium,
                  }}>
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: Colors.white1,
          justifyContent: 'space-around',
          flexDirection: 'row',
          padding: horizontalScale(10),
        }}>
        <TouchableOpacity onPress={onReset} style={styles.button}>
          <Text style={styles.reset}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onApply}
          style={[styles.button, { backgroundColor: Colors.orange }]}>
          <Text style={styles.apply}>Apply</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: moderateScale(18),
    color: Colors.black2,
    fontFamily: Fonts.PoppinsRegular,
  },
  button: {
    height: horizontalScale(45),
    borderRadius: horizontalScale(3),
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  apply: {
    fontSize: moderateScale(16),
    color: Colors.white,
    fontFamily: Fonts.PoppinsBold,
  },
  reset: {
    fontSize: moderateScale(16),
    color: Colors.orange,
    fontFamily: Fonts.PoppinsRegular,
  },
});

export default FilterModal;
