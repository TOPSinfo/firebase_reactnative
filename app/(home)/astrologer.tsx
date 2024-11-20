import AstrologersList from '@/components/AstrologersList';
import DetailsHeader from '@/components/DetailsHeader';
import FilterModal from '@/components/FilterModal';
import SvgImage from '@/components/SvgImage';
import { Colors } from '@/constants/Colors';
import { Images } from '@/constants/Images';
import { astrologersSelector } from '@/redux/selector';
import { horizontalScale } from '@/utils/matrix';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const SelectAstrologer = () => {
  const [filterVisible, setFilterVisible] = useState(false);

  const astrologers = astrologersSelector();

  const [astrologersList, setAstrologersList] = useState(astrologers);

  const onFilter = () => {
    setFilterVisible(true);
  };

  const onReset = () => {
    setFilterVisible(false);
    setAstrologersList(astrologers);
  };

  const onApply = (
    sort: string,
    skills: string[],
    language: string[],
    gender: string
  ) => {
    const filteredAstrologers = astrologers.filter((astrologer: any) => {
      const genderMatch = gender ? astrologer.gender === gender : true;
      const skillsMatch = skills.length
        ? skills.some(skill => astrologer.skills.includes(skill))
        : true;
      const languageMatch = language.length
        ? language.some(lng => astrologer.language.includes(lng))
        : true;
      return genderMatch && skillsMatch && languageMatch;
    });
    setAstrologersList(filteredAstrologers);
    setFilterVisible(false);
  };

  const renderRight = () => {
    return (
      <TouchableOpacity
        onPress={onFilter}
        style={{
          width: '10%',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
        <SvgImage
          url={Images.filter}
          style={{
            height: horizontalScale(16),
            width: horizontalScale(16),
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <DetailsHeader title="Select Astrologer" rightOption={renderRight()} />
      <View
        style={{
          flex: 1,
          padding: horizontalScale(20),
          backgroundColor: Colors.white,
        }}>
        <AstrologersList data={astrologersList} scrollable={true} />
      </View>
      <FilterModal
        visible={filterVisible}
        onResetFilter={onReset}
        onApplyFilter={onApply}
      />
    </View>
  );
};

export default SelectAstrologer;
