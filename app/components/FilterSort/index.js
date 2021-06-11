import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import {Icon, Text, Button} from '@components';
import PropTypes from 'prop-types';
import {BaseColor, useTheme} from '@config';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

export default function FilterSort(props) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const backgroundColor = colors.background;
  const cardColor = colors.card;

 
  const [sortSelected, setSortSelected] = useState(props.sortSelected);
  const [modalVisible, setModalVisible] = useState(false);

  

  const iconModeView = modeView => {
    switch (modeView) {
      case 'block':
        return 'square';
      case 'grid':
        return 'th-large';
      case 'list':
        return 'th-list';
      default:
        return 'th-list';
    }
  };

  const {style, modeView, onFilter, onChangeView, labelCustom} = props;
  const customAction =
    modeView != '' ? (
      <TouchableOpacity onPress={onChangeView} style={styles.contentModeView}>
        <Icon
          name={iconModeView(modeView)}
          size={16}
          color={BaseColor.grayColor}
          solid
        />
      </TouchableOpacity>
    ) : (
      <Text headline grayColor numberOfLines={1} style={styles.contentModeView}>
        {labelCustom}
      </Text>
    );

  return (
    <View style={[styles.contain, {backgroundColor}, style]}>
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
    
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <View
          style={[styles.contentFilterBottom, {backgroundColor: cardColor}]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
       
          <Button
            full
            style={{marginTop: 10, marginBottom: 20}}
            onPress={() => onApply()}>
            {t('apply')}
          </Button>
        </View>
      </Modal>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {customAction}
        <View style={styles.line} />
        <TouchableOpacity onPress={onFilter} style={styles.contentFilter}>
          <Icon name="filter" size={16} color={BaseColor.grayColor} solid />
          <Text headline grayColor style={{marginLeft: 5}}>
            {t('filter')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

FilterSort.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),

  modeView: PropTypes.string,

  
  onChangeView: PropTypes.func,
  onFilter: PropTypes.func,
};

FilterSort.defaultProps = {
  style: {},
 
 
  modeView: '',
  labelCustom: '',
  onChangeSort: () => {},
  onChangeView: () => {},
  onFilter: () => {},
};
