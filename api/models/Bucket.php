<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "bucket".
 *
 * @property int $id
 * @property string $name
 * @property int $timecreated
 * @property int|null $clientid
 * @property int $archived
 * @property int $prepaid
 *
 * @property Client $client
 * @property Hours[] $hours
 */
class Bucket extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'bucket';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['name', 'timecreated'], 'required'],
            [['timecreated', 'clientid', 'archived', 'prepaid'], 'default', 'value' => null],
            [['timecreated', 'clientid', 'archived', 'prepaid'], 'integer'],
            [['name'], 'string', 'max' => 255],
            [['clientid'], 'exist', 'skipOnError' => true, 'targetClass' => Client::className(), 'targetAttribute' => ['clientid' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'timecreated' => 'Timecreated',
            'clientid' => 'Clientid',
            'archived' => 'Archived',
            'prepaid' => 'Prepaid',
        ];
    }

    /**
     * Gets query for [[Client]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getClient()
    {
        return $this->hasOne(Client::className(), ['id' => 'clientid']);
    }

    /**
     * Gets query for [[Hours]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getHours()
    {
        return $this->hasMany(Hours::className(), ['bucketid' => 'id']);
    }
}
