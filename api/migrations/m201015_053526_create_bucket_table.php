<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%bucket}}`.
 * Has foreign keys to the tables:
 *
 * - `{{%client}}`
 */
class m201015_053526_create_bucket_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%bucket}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string()->notNull(),
            'timecreated' => $this->integer()->notNull(),
            'clientid' => $this->integer(),
            'archived' => $this->integer(1)->notNull()->defaultValue(0),
        ]);

        // creates index for column `clientid`
        $this->createIndex(
            '{{%idx-bucket-clientid}}',
            '{{%bucket}}',
            'clientid'
        );

        // add foreign key for table `{{%client}}`
        $this->addForeignKey(
            '{{%fk-bucket-clientid}}',
            '{{%bucket}}',
            'clientid',
            '{{%client}}',
            'id',
            'CASCADE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        // drops foreign key for table `{{%client}}`
        $this->dropForeignKey(
            '{{%fk-bucket-clientid}}',
            '{{%bucket}}'
        );

        // drops index for column `clientid`
        $this->dropIndex(
            '{{%idx-bucket-clientid}}',
            '{{%bucket}}'
        );

        $this->dropTable('{{%bucket}}');
    }
}
