<template>

    <div id="aiCalendar" v-if="authenticated && productScope.length" class="bg-grey-2">
        <div class="well" style="padding: 0;">
            <q-slide-transition>
                <div v-if="!showContentFiltering" align="center">
                    <q-btn outline @click="showContentFiltering = true" class="monty" :style="`background: #fff !important; color: #333; padding: .8rem 2rem;`">
                        <h6 class="thickHeader" style="font-size: .8rem; letter-spacing: 1px; margin: 0;">CHANGE {{contentName}} PLAN</h6>
                    </q-btn>
                </div>
            </q-slide-transition>

            <q-slide-transition>
                <div v-if="showContentFiltering" class="row" style="padding: .5rem 0;">
                    <div class="col-12">
                        <q-btn @click="showContentFiltering = false" class="float-right" flat round>
                            <q-icon name="fas fa-times" />
                        </q-btn>
                    </div>

                    <div class="col-12 relative-position padded">
                        <questionMarkHelp class="col-12" :componentData="{}" :helpContents="contentFilteringHelpHTML" style="margin-top: 1rem; padding: 1rem 0;" />

                        <h6 style="margin-top: 1rem;">My {{contentName}} plan:</h6>
                    </div>

                    <div v-for="menu in tagSelectMenus" class="col-sm-12 col-lg-4 padded">
                        <div class="bg-white shadow-4 padded" style="height: 100%;">
                            <div class="row justify-center" align="center">
                                <div class="col-12">
                                    <h6>{{menu.title}}</h6>
                                    <div style="margin: .5rem 0; border-bottom: 1px #cdcdcd solid;"></div>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-6" v-for="tag in tagOptions(menu.dataKey)">
                                    <div class="filterButton" align="center" @click="toggleTag(tag)" :style="localUserSelectedTags.includes(tag.id) ? 'background: ' + highlightColor + '; color: #fff;' : ''">
                                        <h6 style="font-size: .8rem; margin: .5rem;">{{tag.tagName}}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-12 col-md-6 padded">
                        <div class="bg-white shadow-4 padded" style="height: 100%;">
                            <div class="row justify-center" align="center">
                                <div class="col-12">
                                    <h6>Select Days</h6>
                                    <div style="margin: .5rem 0; border-bottom: 1px #cdcdcd solid;"></div>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-6" v-for="(tag, index) in daysOfWeek">
                                    <div class="filterButton" align="center" @click="toggleDayToViewContent(tag)" :style="daysToViewContent.includes(tag) ? 'background: ' + highlightColor + '; color: #fff;' : ''">
                                        <h6 class="gt-md" style="font-size: .8rem; margin: .5rem;">{{moment.weekdays(true, index)}}</h6>
                                        <h6 class="lt-lg" style="font-size: .8rem; margin: .5rem;">{{moment.weekdaysShort(true, index)}}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-12 col-md-6 padded">
                        <div class="bg-white shadow-4 padded" style="height: 100%;">
                            <div class="row">
                                <div class="col-12" align="center">
                                    <h6>SMS Reminders</h6>
                                    <div style="margin: .5rem 0; border-bottom: 1px #cdcdcd solid;"></div>
                                </div>
                                <div class="col-12" style="padding: .5rem;">

                                    <div style="max-width: 400px; margin: 0 auto;">

                                        <q-input
                                            v-model="phoneNumber"
                                            class="inputBox"
                                            :attributes="{autocompletetype: 'tel', autocorrect: 'off'}"
                                            id="phoneNumber"
                                            placeholder="(123) 456-7890"
                                            color="grey-7"
                                            v-mask="'###############'"
                                            align="center"
                                            :style="`padding: .5rem; margin-top: 0; border: 1px solid ${highlightColor};`"
                                        />

                                        <q-btn size="sm" :disable="(!phoneNumber || (phoneNumber.replace(/-|\(|\)| /g, '') && userInfo.phoneNum && phoneNumber.replace(/-|\(|\)| /g, '') === userInfo.phoneNum)) ? true : false" class="full-width" @click="savePhoneNumberIfNecessary" :style="`background: ${highlightColor};`">
                                            <h6 style="font-size: .8rem; color: #fff;">Save My Phone #</h6>
                                        </q-btn>

                                        <div style="border-bottom: 1px solid #cdcdcd; margin: 1rem 0;"></div>

                                        <q-slide-transition>
                                            <div v-if="useReminders" style="padding: .5rem;">

                                                <h6 align="center" style="font-size: .8rem;">Select Reminder Time:</h6>
                                                <timePicker
                                                    :inputTimeString="defaultReminderTime"
                                                    @outputTimeString="defaultReminderTimeSelected"
                                                    :style="`color: ${highlightColor};`"
                                                />
                                            </div>
                                        </q-slide-transition>

                                        <q-btn class="full-width" @click="remindMe" :style="`background: ${highlightColor};`">
                                            <h6 style="font-size: .8rem; color: #fff;">{{useReminders ? 'Cancel default reminder' : 'Set default reminder'}}</h6>
                                        </q-btn>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 padded">
                        <h6>Total Matching: {{contentPool.length}}</h6>

                        <q-btn outline size="lg" :disable="!contentPool || !contentPool.length" @click="userWantsToRegenerateCalendarContent = true, generateContentScheduleForCurrentMonth()" :style="`margin: 1rem 0; background: #fff !important; color: #333;`">
                            <h6 style="letter-spacing: 1px; margin: 0;">Generate my plan!</h6>
                        </q-btn>

                        <div style="margin: .5rem 0; border-bottom: 1px #cdcdcd solid;"></div>
                    </div>

                </div>
            </q-slide-transition>

            <div v-if="contentScheduleHelpHTML" class="col-12 relative-position padded">
                <questionMarkHelp class="col-12" :componentData="{}" :helpContents="contentScheduleHelpHTML" style="margin-top: 1rem; padding: 1rem 0;" />
            </div>

            <q-card class="bg-white" v-if="displayCalendar">
                <q-card-main align="center" class="row">

                    <div class="col-2 relative-position" align="left">
                        <q-btn flat
                            v-if="Number(moment(startDate).format('YYYY')) > moment().subtract(2, 'years').format('YYYY')"
                            @click="changeStartDate(-1)"
                            :style="`padding: .25rem; color: ${highlightColor};`">
                                <div class="row">
                                    <div class="col-6">
                                        <q-icon name="fas fa-chevron-left" :style="`margin: 0; color: ${highlightColor};`" />
                                    </div>
                                    <div class="col-6" align="left">
                                        <h6 class="gt-sm" style="font-size: .7rem; margin: 0;">LAST MONTH</h6>
                                    </div>
                                </div>
                        </q-btn>
                    </div>

                    <div class="col-8">
                        <h2 :style="`color: ${highlightColor}; margin-top: 0; ${windowWidth < 350 ? 'font-size: 1.6rem;' : ''}`">{{selectedMonthName}} {{selectedYear}}</h2>
                    </div>

                    <div class="col-2 relative-position" align="right">
                        <q-btn flat
                            v-if="moment(startDate).format('YYYY') < moment().add(2, 'years').format('YYYY')"
                            @click="changeStartDate(1)"
                            :style="`padding: .25rem; color: ${highlightColor};`">
                                <div class="row">
                                    <div class="col-6" align="right">
                                        <h6 class="gt-sm" style="font-size: .7rem; margin: 0;">NEXT MONTH</h6>
                                    </div>
                                    <div class="col-6">
                                        <q-icon name="fas fa-chevron-right" :style="`margin: 0; color: ${highlightColor};`" />
                                    </div>
                                </div>
                        </q-btn>
                    </div>

                </q-card-main>

                <q-card-main style="padding: 0;">

                    <div class="row">
                        <div v-for="(item, index) in daysOfWeek" :style="'background: ' + highlightColor + '; color: #fff; padding: .5rem .25rem;'" class="col monty allCaps" align="center">
                            <h6 class="thickHeader gt-md" style="font-size: .9rem;">{{moment.weekdays(true, index)}}</h6>
                            <h6 class="thickHeader lt-lg gt-xs" style="font-size: .9rem;">{{moment.weekdaysShort(true, index)}}</h6>
                            <h6 class="thickHeader xs" style="font-size: .9rem;">{{moment.weekdaysMin(true, index)}}</h6>
                        </div>
                    </div>

                    <q-inner-loading :visible="calendarLoad" />

                    <!--calendar-->
                    <transition-group
                        v-if="!calendarLoad"
                        id="calendar"
                        name="staggered-fade"
                        tag="div"
                        v-bind:css="false"
                        v-on:before-enter="beforeEnter"
                        v-on:enter="enter"
                    >
                        <div
                            class="day"
                            v-for="(day, index) in displayCalendar"
                            :key="index"
                            :data-index="index"
                        >

                            <div @click="showDayDetails(index)" v-if="userContentScheduleNotes && userContentScheduleNotes[monthDataKey] && userContentScheduleNotes[monthDataKey][index]" :style="`cursor: pointer; background: ${highlightColor}; color: #fff; padding: ${windowWidth > 767 ? '.25rem .5rem' : '.1rem 0.25rem'}; position: absolute; bottom: 1px; left: 50%; transform: translateX(-50%); z-index: 1;`">
                                <h6 style="font-size: .8rem; margin: 0;">
                                    <q-icon name="fas fa-pencil-alt" style="font-size: .8rem;" />
                                </h6>
                            </div>

                            <div @click="showDayDetails(index)" v-if="day.today" :style="`cursor: pointer; background: ${brandColor}; color: #fff; padding: ${windowWidth > 767 ? '.25rem .5rem' : '.1rem 0.25rem'}; position: absolute; top: .5rem; right: 1px; z-index: 1;`">
                                <h6 style="font-size: .8rem; margin: 0;">
                                    <q-icon name="fas fa-calendar" style="font-size: .8rem;" />
                                </h6>
                            </div>

                            <div v-if="day.dayNumber" class="card">

                                <div v-if="showContentForCalendarDay(day, index)" align="center" style="height: 100%; cursor: pointer;">
                                    <div class="pchip gt-sm" v-if="productIsNew(userContentSchedule[monthDataKey][index])" :style="`background: ${highlightColor}; padding-right: 1rem; position: absolute; top: .5rem; left: 0; z-index: 1; clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%); -webkit-clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%);`">
                                        <h6 style="font-size: .8rem; margin: 0;">NEW!</h6>
                                    </div>

                                    <div class="contentDay" :style="`background: url('${coverImageURL(userContentSchedule[monthDataKey][index].productSKU)}');`">

                                        <div @click="showDayDetails(index)" style="height: 100%; width: 100%; background: rgba(80, 80, 80, 0.7);">
                                            <div class="gt-sm" v-if="userContentSchedule[monthDataKey][index].userLocked" style="position: absolute; top: 0; right: 0;">
                                                <q-btn size="sm" class="float-right" flat style="padding: .25rem;">
                                                    <q-icon name="fas fa-lock" color="white" />
                                                </q-btn>
                                            </div>

                                            <div style="padding-top: 1rem;">

                                                <div :style="'font-size: .9rem; color: #fff;'" class="monty allCaps thickHeader" align="center">
                                                    <span class="gt-sm">{{ day.theMonth }}</span>
                                                    {{ day.dayNumber }}
                                                </div>

                                                <div class="gt-sm text-white" style="font-size: .8rem; padding: .25rem;">
                                                    <strong>{{userContentSchedule[monthDataKey][index].displayName}}</strong>
                                                </div>
                                            </div>

                                            <div class="gt-sm" style="position: absolute; bottom: 0; width: 100%;">
                                                <q-btn size="sm" class="float-right" flat @click.stop="selectItem(userContentSchedule[monthDataKey][index])" style="padding: .25rem;">
                                                    <q-icon name="fas fa-play-circle" color="white" />
                                                </q-btn>

                                                <q-btn size="sm" class="float-left" flat style="padding: .25rem;">
                                                    <q-icon name="fas fa-cog" color="white" />
                                                </q-btn>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div v-else-if="userContentSchedule && moment(day.theDate).endOf('day').format('X') >= moment().startOf('day').format('X')" @click="showDayDetails(index)">
                                    <div align="center" style="padding: .25rem;">
                                        <div style="font-size: .8rem; color: #444; padding-top: 1rem;" class="monty allCaps" align="center">
                                            <span class="gt-sm">{{ day.theMonth }}</span>
                                            {{ day.dayNumber }}
                                        </div>

                                        <q-btn class="bg-grey-3" size="sm" round flat @click.stop="addContentForDay(index)" style="margin: .25rem 0;">
                                            <q-icon name="fas fa-plus" style="color: #333;" />
                                        </q-btn>
                                    </div>

                                    <div v-if="specialContentName && userHasAccessToAnySpecialContent" class="gt-sm" align="center" style="width: 100%;">
                                        <q-btn size="xs" outline @click.stop="showSpecialContent()" style="background: #fff !important; color: #333;">
                                            <h6 style="font-size: .7rem; margin: 0; letter-spacing: 1px;">{{specialContentName}}</h6>
                                        </q-btn>
                                    </div>
                                </div>

                                <div v-else align="center" @click="showDayDetails(index)" style="height: 100%; padding: .25rem; cursor: pointer;">
                                    <div style="font-size: .8rem; color: #444; padding-top: 1rem;" class="monty allCaps" align="center">
                                        <span class="gt-sm">{{ day.theMonth }}</span>
                                        {{ day.dayNumber }}
                                    </div>

                                    <q-btn v-if="day.viewingData && !day.today" flat class="full-width" style="padding: .3rem;">
                                        <div class="full-width">
                                            <img :src="contentCompleteImageSrc" style="width: 2rem; max-width: 100%;" />
                                        </div>
                                        <div class="gt-sm" style="font-size: .75rem; color: #444; text-transform: none;">
                                            {{(productTotalCount(day.viewingData) / 60).toFixed(1)}} mins
                                        </div>
                                    </q-btn>
                                </div>
                            </div>
                        </div>
                    </transition-group>

                </q-card-main>

            </q-card>

            <div v-if="displayCalendar && currentMonthContainsLockedItems" align="right" style="padding: 0 .5rem;">
                <q-btn outline class="bg-white" size="sm" @click="unlockAllDays()" style="background: #fff !important; color: #333;">
                    <q-icon name="fas fa-unlock" style="font-size: .8rem;" />
                    <span style="font-size: .8rem; letter-spacing: 1px;">
                        Unlock all days
                    </span>
                </q-btn>
            </div>
        </div>

        <q-modal
            v-model="openDayDetailModal"
            @hide="selectedDayIndex = 0"
            :content-css="{minWidth: '60vw', minHeight: '60vh'}"
        >
            <q-modal-layout v-if="displayCalendar && selectedDayIndex && displayCalendar[selectedDayIndex]">

                <q-toolbar class="q-layout-header" color="grey" :style="toolbarStyle">
                    <q-toolbar-title>
                        <h5>{{displayCalendar[selectedDayIndex].theMonth}} {{displayCalendar[selectedDayIndex].dayNumber}} {{moment(displayCalendar[selectedDayIndex]).format('YYYY')}}</h5>
                    </q-toolbar-title>
                    <q-btn flat round icon="fas fa-times" @click="openDayDetailModal = false" style="padding: .5rem;" />
                </q-toolbar>

                <template v-if="showContentForCalendarDay(displayCalendar[selectedDayIndex], selectedDayIndex) && userContentScheduleForDay && userContentScheduleForDay.displayName">
                    <div class="row" style="padding: .5rem;">

                        <div class="col-md-12 col-lg-6" align="center">
                            <div class="contentScheduleCard relative-position" @click="selectItem(userContentScheduleForDay)">
                                <div class="pchip" v-if="productIsNew(userContentScheduleForDay)" :style="`background: ${highlightColor}; padding-right: 1rem; position: absolute; top: 1rem; left: 0; z-index: 1; clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%); -webkit-clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%);`">
                                    <h6 style="font-size: .8rem;">NEW!</h6>
                                </div>

                                <img :src="coverImageURL(userContentScheduleForDay.productSKU)" style="max-width: 100%;" />

                                <div style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);">
                                    <q-icon name="fas fa-play" style="font-size: 3rem; color: rgba(255, 255, 255, 0.8);" />
                                </div>

                                <div v-if="productDuration(userContentScheduleForDay.productSKU)" style="padding: .5rem; background: #efefef; position: absolute; bottom: .8rem; right: .5rem; z-index: 1;">
                                    <h6 class="thickHeader" :style="`font-size: .7rem; color: ${highlightColor};`">{{moment(productDuration(userContentScheduleForDay.productSKU) * 1000).format('mm:ss')}}</h6>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-12 col-lg-6 padded">
                            <h6 style="font-size: .9rem;">Your {{contentName}} For Today Is:</h6>
                            <h4 class="thickHeader" :style="`line-height: 1.5rem; margin: .5rem 0; color: ${highlightColor};`">
                                {{userContentScheduleForDay.displayName}}
                            </h4>

                            <hr />

                            <div class="row">
                                <div class="col-4" style="padding: .2rem;">
                                    <q-btn outline size="sm" @click="toggleLockContentForDay(selectedDayIndex)" class="full-width" style="background: #fff !important; color: #333; letter-spacing: 1px;">
                                        <q-icon :name="userContentScheduleForDay.userLocked ? 'fas fa-lock' : 'fas fa-unlock'" style="font-size: .7rem; margin-left: 0;" /> {{userContentScheduleForDay.userLocked ? 'unlock' : 'lock'}}
                                    </q-btn>
                                </div>

                                <div class="col-4" style="padding: .2rem;">
                                    <q-btn outline size="sm" @click="refreshContentForDay(selectedDayIndex)" class="full-width" style="background: #fff !important; color: #333; letter-spacing: 1px;">
                                        <q-icon name="fas fa-sync-alt" style="font-size: .7rem; margin-left: 0;" /> replace
                                    </q-btn>
                                </div>

                                <div class="col-4" style="padding: .2rem;">
                                    <q-btn outline size="sm" @click="removeContentForDay(selectedDayIndex), openDayDetailModal = false" class="full-width" style="background: #fff !important; color: #333; letter-spacing: 1px;">
                                        <q-icon name="fas fa-times" style="font-size: .7rem; margin-left: 0;" /> Remove
                                    </q-btn>
                                </div>
                            </div>

                            <div v-if="userContentScheduleForDay.reminderDocID" style="padding: 1rem 0;">
                                <h6>Reminder time:</h6>
                                <div style="margin: .5rem 0; border-bottom: 1px #cdcdcd solid;"></div>

                                <timePicker
                                    :inputTimeString="String(moment(userContentScheduleForDay.timestamp).format('H:mm'))"
                                    @outputTimeString="reminderTimeSelected(selectedDayIndex, $event)"
                                    style="padding: 0;"
                                />
                            </div>

                            <div v-else style="padding: 1rem 0;">
                                <h6 style="font-size: .9rem;">No Reminder</h6>
                            </div>
                        </div>

                        <aiCalendarNotes :monthDataKey="monthDataKey" :selectedDayIndex="selectedDayIndex" :highlightColor="highlightColor" :userContentScheduleNoteText="userContentScheduleNotesForDay" />

                        <div class="col-12" v-html="contentDescription" style="padding: .5rem;" />

                    </div>
                </template>

                <template v-else>
                    <div class="row" style="padding: .5rem;">

                        <div v-if="displayCalendar[selectedDayIndex].viewingData && !displayCalendar[selectedDayIndex].today" class="col-sm-12 padded">
                            <div class="padded">
                                <img :src="contentCompleteImageSrc" style="width: 5rem; max-width: 100%; margin: 0 auto; display: block;" />
                                <h3 align="center">You completed your {{contentName}}!</h3>
                            </div>

                            <hr />

                            <h5>Viewing History</h5>

                            <q-list separator>
                                <q-item v-for="item in displayCalendar[selectedDayIndex].viewingData" :key="item.productID">
                                    <q-item-main>
                                        {{item.productName}}
                                    </q-item-main>
                                    <q-item-side>
                                        {{(item.secondsViewed / 60).toFixed(1)}} mins
                                    </q-item-side>
                                </q-item>
                                <q-item class="bg-grey-3">
                                    <q-item-main>
                                        Total
                                    </q-item-main>
                                    <q-item-side>
                                        {{ (productTotalCount(displayCalendar[selectedDayIndex].viewingData) / 60).toFixed(1)}} mins
                                    </q-item-side>
                                </q-item>
                            </q-list>
                        </div>

                        <aiCalendarNotes :monthDataKey="monthDataKey" :selectedDayIndex="selectedDayIndex" :highlightColor="highlightColor" :userContentScheduleNoteText="userContentScheduleNotesForDay" />
                    </div>
                </template>

            </q-modal-layout>

        </q-modal>

        <q-modal
            v-model="openSpecialContentModal"
            :content-css="{minWidth: '60vw', minHeight: '60vh'}"
        >
            <q-modal-layout v-if="specialContentDetail" >

                <q-toolbar class="q-layout-header" color="grey" :style="toolbarStyle">
                    <q-toolbar-title>
                        <!--<h5>{{displayCalendar[selectedDayIndex].theMonth}} {{displayCalendar[selectedDayIndex].dayNumber}} {{moment(displayCalendar[selectedDayIndex]).format('YYYY')}}</h5>-->
                    </q-toolbar-title>
                    <q-btn flat icon="fas fa-times" @click="openSpecialContentModal = false" style="padding: .5rem;" />
                </q-toolbar>

                <div class="row" style="padding: .5rem;">

                    <div class="col-md-12 col-lg-6" align="center">
                        <div class="relative-position" @click="selectItem(specialContentDetail)" style="width: fit-content; padding: .5rem; cursor: pointer;">
                            <div class="pchip" v-if="productIsNew(specialContentDetail)" :style="`background: ${highlightColor}; padding-right: 1rem; position: absolute; top: 1rem; left: 0; z-index: 1; clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%); -webkit-clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%);`">
                                <h6 style="font-size: .8rem; margin: 0;">NEW!</h6>
                            </div>

                            <img :src="coverImageURL(specialContentDetail.productSKU)" style="max-width: 100%;" />

                            <div style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);">
                                <q-icon name="fas fa-play" style="font-size: 3rem; color: rgba(255, 255, 255, 0.8);" />
                            </div>
                        </div>
                    </div>

                    <div class="col-md-12 col-lg-6 padded">
                        <h6 style="font-size: .9rem;">Your {{specialContentName}} For Today Is:</h6>
                        <h4 class="thickHeader" :style="`line-height: 1.5rem; margin: .5rem 0; color: ${highlightColor};`">{{specialContentDetail.productName}}</h4>

                        <hr />

                        <div class="row">
                            <div class="col-12" style="padding: .25rem;">
                                <q-btn @click="showSpecialContent()" class="full-width" :style="`padding: .3rem; background: ${replaceButtonColor} ; color: #fff;`">
                                    <q-icon name="fas fa-sync-alt" /> Next
                                </q-btn>
                            </div>
                        </div>
                    </div>

                    <div class="col-12" v-html="contentDescription" style="padding: .5rem;" />

                </div>

            </q-modal-layout>

        </q-modal>

    </div>

</template>

<script>
    import timePicker from '../timePicker'
    import aiCalendarNotes from './aiCalendarNotes'
    import questionMarkHelp from '../questionMarkHelp'

    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { contentItemFiltering } from '../../../mixins/contentItemFiltering'
    import { designTools } from '../../../mixins/designTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { contentScheduleTools } from '../../../mixins/contentScheduleTools'
    import { productInfoTools } from '../../../mixins/productInfoTools'

    export default {
        props: ['contentName', 'specialContentName', 'specialContentTagID', 'productScope', 'tagSelectMenus', 'contentCompleteImageSrc', 'smsReminderTemplateName', 'contentFilteringHelpHTML', 'contentScheduleHelpHTML', 'highlightColor', 'replaceButtonColor', 'removeButtonColor'],

        mixins: [designTools, userAndProductInfo, contentItemFiltering, globalComputedData, contentScheduleTools, productInfoTools],

        components: {
            timePicker,
            aiCalendarNotes,
            questionMarkHelp
        },

        data() {
            return {

                showContentFiltering: false,
                showPreferencesHelp: false,
                showCalendarHelp: false,
                newFilters: false,
                calendarLoad: false,
                openDayDetailModal: false,
                openSpecialContentModal: false,

                userContentSchedule: '',
                originalUserContentScheduleMonthData: '',

                startDate: '',
                displayCalendar: '',
                viewingData: '',
                watchUserPreferenceFlag: false,

                monthOffset: 0,
                selectedDayIndex: 0,
                viewThresholdInSeconds: 60 * 5,

                localContentPool: [],

                contentDescription: '',
                specialContentDetail: '',

                productTotalCount(products) {
                    var total = 0
                    products.forEach((product) => {
                        total += product.secondsViewed
                    })
                    return total
                },

                coverImageURL(productSKU) {
                    return `https://f3r6v6t8.ssl.hwcdn.net/static/previews/${productSKU}/${productSKU}_500px_cover.png`
                },

                showContentForCalendarDay(day, index) {
                    let dayContent = this.userContentSchedule && this.monthDataKey && this.userContentSchedule[this.monthDataKey] && index ? this.userContentSchedule[this.monthDataKey][index] : false

                    let notInThePast = dayContent && dayContent.displayName ? this.moment(day.theDate).endOf('day').format('X') >= this.moment().startOf('day').format('X') : false

                    // k('showContentForCalendarDay: ', dayContent.displayName, dayContent, notInThePast)
                    return notInThePast
                },

                productIsNew(day) {
                    // k('productIsNew: ', day)
                    return day.tags ? day.tags.includes('5521') : false
                },

                productSKULookup(productSKU) {
                    // k('productSKULookup: ', productSKU, this.environmentProducts)
                    return this.environmentProducts ? this.environmentProducts.find(product => { return product.productSKU === productSKU }) : ''
                },

                productDuration(productSKU) {
                    // k('productDuration: ', productSKU, this.productSKULookup(productSKU))
                    return this.productSKULookup(productSKU) ? this.productSKULookup(productSKU).duration : ''
                }
            }
        },

        computed: {

            toolbarStyle() {
                return this.highlightColor ? 'background: ' + this.highlightColor + ' !important ;' : ''
            },

            footerStyle() {
                return 'background: ' + this.brandColor + ' !important;'
            },

            firstDayOfCurrentMonth() {
                var date = new Date(),
                    y = date.getFullYear(),
                    m = date.getMonth();
                var firstDay = new Date(y, m, 1);
                return firstDay
            },

            selectedMonthName() {
                return this.moment(this.startDate).format('MMMM')
            },

            selectedYear() {
                return this.moment(this.startDate).format('YYYY')
            },

            monthDataKey() {
                return this.selectedMonthName + (this.selectedYear === '2018' ? '' : this.selectedYear)
            },

            contentPool() {
                return this.productScope ? (this.localUserSelectedTags.length ? this.getProductsThatMatchTags(this.localUserSelectedTags, this.productScope, this.strictThreshold) : this.productScope) : ''
            },

            strictThreshold() {
                // weeks per month multiplied by number of selected days
                return 4 * this.daysToViewContent.length
            },

            totalCalendarDays() {
                return this.moment(this.startDate).daysInMonth()
            },

            currentMonthContainsLockedItems() {
                return this.userContentSchedule && this.userContentSchedule[this.monthDataKey] ? this.userContentSchedule[this.monthDataKey].filter((day) => {
                    return day.userLocked
                }).length : false
            },

            specialContentFromEnvironmentProducts() {
                // if (!this.environmentProducts.length) this.environmentProducts = this.j_.cloneObject(this.contentPool)
                // k('this.environmentProducts: ', this.environmentProducts)

                let specialContentFromEnvironmentProducts = this.environmentProducts.filter((contentItem) => {
                    return contentItem.tags.indexOf(this.specialContentTagID) > -1
                })
                k('specialContentFromEnvironmentProducts: ', specialContentFromEnvironmentProducts)

                return specialContentFromEnvironmentProducts
            },

            userHasAccessToAnySpecialContent() {
                let specialContentFromEnvironmentProductIDs = this.specialContentFromEnvironmentProducts.map((product) => {
                    return product.productID
                })
                k('specialContentFromEnvironmentProductIDs: ', specialContentFromEnvironmentProductIDs)
                return this.userHasAccess(specialContentFromEnvironmentProductIDs)
            },

            userContentScheduleForDay() {
                return this.userContentSchedule && this.userContentSchedule[this.monthDataKey] && this.userContentSchedule[this.monthDataKey][this.selectedDayIndex] ? this.userContentSchedule[this.monthDataKey][this.selectedDayIndex] : ''
            },

            userContentScheduleNotesPreference() {
                return this.userPreferences ? this.userPreferences.find(preference => preference.type === 'userContentScheduleNotes') : ''
            },

            userContentScheduleNotes() {
                return this.userContentScheduleNotesPreference ? this.userContentScheduleNotesPreference.noteData : ''
            },

            userContentScheduleNotesPreferenceID() {
                return this.userContentScheduleNotesPreference && this.userContentScheduleNotesPreference.id ? this.userContentScheduleNotesPreference.id : ''
            },

            userContentScheduleNotesForDay() {
                return this.userContentScheduleNotes && this.userContentScheduleNotes[this.monthDataKey] && this.userContentScheduleNotes[this.monthDataKey][this.selectedDayIndex] ? this.userContentScheduleNotes[this.monthDataKey][this.selectedDayIndex] : ''
                // return 'HEY THIS IS A NOTE'
            }
        },

        methods: {

            selectItem(item) {
                k('selectItem: ', item)

                if (this.notSelectable) return false

                this.$store.commit('setCurrentProduct', item)
                this.$store.commit('setProductLaunchContext', 'aiCalendar')

                this.route('/play/' + item.productID)
            },

            setupCalendar() {
                k('setupCalendar: ', this.savedUserPreferenceItemID)
                k('userWantsToRegenerateCalendarContent: ', this.userWantsToRegenerateCalendarContent)

                // new workouts should replace unlocked items when:
                // user arrives on page has a generated month and it does not contain all new items
                // user generates a month
                // system auto generates new month

                this.getUserMediaPlayData(() => {
                    // open filters if no saved contentSchedulePreferences
                    if (!this.savedUserPreferenceItemID) {
                        this.showContentFiltering = true

                        this.calendarLoad = false
                        this.generateCurrentMonth(() => {})
                    } else {

                        if (this.userWantsToRegenerateCalendarContent ||
                            (this.userContentSchedule && !this.userContentSchedule[this.monthDataKey]) ||
                            (this.userContentSchedule && this.userContentSchedule[this.monthDataKey] && this.userDoesNotHaveAccessToAllItemsInCurrentMonth())
                        ) {
                            k('generating content')
                            // this.generateCurrentMonth(() => {
                                this.generateContentScheduleForCurrentMonth()
                            // })
                        }
                        else {
                            k('generating current month')
                            this.calendarLoad = false
                            this.generateCurrentMonth(() => {
                                // replace non locked items with new products
                                if (this.userContentSchedule && this.userContentSchedule[this.monthDataKey]) {
                                    this.replaceUnlockedContentWithNewItemsFromContentPoolNotInCurrentMonth((addedNewItems) => {
                                        if (addedNewItems) {
                                            // save new schedule
                                            this.saveContentSchedulePreferences(() => {
                                                this.generateCurrentMonth(() => {})
                                            })
                                        }
                                    })
                                }
                            })
                        }

                    }

                })
            },

            userDoesNotHaveAccessToAllItemsInCurrentMonth() {
                let userHasAccessToAllItems = true
                let currentMonthProducts = this.userContentSchedule[this.monthDataKey].filter((contentItem) => {
                    return contentItem.productID
                }).forEach((contentItem) => {
                    let environmentProduct = this.environmentProducts.find(product => { return product.productID === contentItem.productID })
                    if (!environmentProduct || !environmentProduct.userActiveProduct) {
                        userHasAccessToAllItems = false
                    }
                })
                k('currentMonthProducts: ', currentMonthProducts)

                k('userHasAccessToAllItems: ', userHasAccessToAllItems)
                return !userHasAccessToAllItems
            },

            showDayDetails(dayIndex) {
                this.selectedDayIndex = dayIndex

                var day = this.userContentSchedule && this.userContentSchedule[this.monthDataKey] ? this.userContentSchedule[this.monthDataKey][dayIndex] : ''
                k('showDayDetails: ', day)

                if (day) {
                    k('reminder time details: ', day.timestamp, this.moment(day.timestamp).format('H:mm'))

                    k('this.userContentScheduleNotesForDay: ', this.userContentScheduleNotesForDay)
                    if (day.productID) this.getMoreInfoForProduct(day.productID)
                }

                this.openDayDetailModal = true
            },

            getMoreInfoForProduct(productID) {
                this.getProductMetaFromAPI(productID, (res) => {
                    var productData = res.productMeta
                    // k('productData', productData)

                    this.contentDescription = productData.moreInfo
                })
            },

            showSpecialContent() {
                let specialContentPool = this.specialContentFromEnvironmentProducts

                let randomInteger = this.j_.randomInteger(0, specialContentPool.length - 1)
                k('randomInteger: ', randomInteger)

                let splicedItemArray = specialContentPool.splice(randomInteger, 1)
                k('splicedItemArray: ', splicedItemArray)

                this.specialContentDetail = splicedItemArray[0]

                k('specialContentDetail: ', this.specialContentDetail)

                this.getMoreInfoForProduct(this.specialContentDetail.productID)
                this.openSpecialContentModal = true
            },

            addContentForDay(dayIndex) {
                k('addContentForDay: ', dayIndex)

                let currentMonthSchedule = this.userContentSchedule[this.monthDataKey]
                    currentMonthSchedule[dayIndex] = this.getContentFromPool(dayIndex + 1)
                    currentMonthSchedule[dayIndex].userLocked = true

                if (this.useReminders && currentMonthSchedule[dayIndex].timestamp) {
                    let reminderActionsToInsert = this.createInsertReminderActions([currentMonthSchedule[dayIndex]])
                    k('reminderActionsToInsert: ', j(reminderActionsToInsert))

                    this.sendRemindersToAPI(reminderActionsToInsert, () => {
                        this.saveContentSchedulePreferences(() => {
                            this.generateCurrentMonth(() => {})
                        })
                    })
                } else {
                    this.saveContentSchedulePreferences(() => {
                        this.generateCurrentMonth(() => {})
                    })
                }
            },

            refreshContentForDay(dayIndex) {
                k('refreshContentForDay: ', dayIndex)

                let currentMonthSchedule = this.userContentSchedule[this.monthDataKey]
                    currentMonthSchedule[dayIndex] = this.getContentFromPool(dayIndex + 1)
                    currentMonthSchedule[dayIndex].userLocked = true
                // this.generateCurrentMonth(() => {})

                k('new refreshContentForDay: ', currentMonthSchedule[dayIndex])

                this.getMoreInfoForProduct(currentMonthSchedule[dayIndex].productID)

                this.selectedDayIndex = 0

                this.saveContentSchedulePreferences(() => {
                    this.generateCurrentMonth(() => {
                        this.selectedDayIndex = dayIndex
                    })
                })
            },

            toggleLockContentForDay(dayIndex) {
                k('toggleLockContentForDay: ', dayIndex)

                this.userContentSchedule[this.monthDataKey][dayIndex].userLocked = !this.userContentSchedule[this.monthDataKey][dayIndex].userLocked
                // this.generateCurrentMonth(() => {})

                this.saveContentSchedulePreferences(() => {
                    this.generateCurrentMonth(() => {})
                })
            },

            unlockAllDays() {
                var monthSchedule = this.userContentSchedule[this.monthDataKey]
                for (var i = 0; i < monthSchedule.length; i++) {
                    let day = monthSchedule[i]
                    if (day && day.userLocked) day.userLocked = false
                }

                this.saveContentSchedulePreferences(() => {
                    this.generateCurrentMonth(() => {})
                })
            },

            removeContentForDay(dayIndex) {
                k('removeContentForDay: ', dayIndex)

                let currentDayData = this.j_.cloneObject(this.userContentSchedule[this.monthDataKey][dayIndex])
                k('currentDayData: ', currentDayData)

                this.userContentSchedule[this.monthDataKey][dayIndex] = {}
                this.userContentSchedule[this.monthDataKey][dayIndex].userLocked = true

                if (currentDayData.reminderDocID) {
                    let reminderActionsToDelete = this.createDeleteReminderActions([currentDayData])
                    k('reminderActionsToDelete: ', j(reminderActionsToDelete))

                    this.sendRemindersToAPI(reminderActionsToDelete, () => {
                        this.saveContentSchedulePreferences(() => {
                            this.generateCurrentMonth(() => {})
                        })
                    })
                } else {
                    this.saveContentSchedulePreferences(() => {
                        this.generateCurrentMonth(() => {})
                    })
                }
            },

            changeStartDate(offset) {
                // k('changeStartDate: ', offset)
                this.monthOffset += offset

                this.startDate = this.moment(this.firstDayOfCurrentMonth).add(this.monthOffset, 'months').valueOf()

                if (
                    (this.userContentSchedule && !this.userContentSchedule[this.monthDataKey]) ||
                    (this.userContentSchedule && this.userContentSchedule[this.monthDataKey] && this.userDoesNotHaveAccessToAllItemsInCurrentMonth())
                ) {
                    // this.generateCurrentMonth(() => {
                        this.generateContentScheduleForCurrentMonth()
                    // })
                }
                else {
                    // this.calendarLoad = false
                    this.generateCurrentMonth(() => {
                        this.replaceUnlockedContentWithNewItemsFromContentPoolNotInCurrentMonth((addedNewItems) => {
                            if (addedNewItems) {
                                // save new schedule
                                this.saveContentSchedulePreferences(() => {
                                    this.generateCurrentMonth(() => {})
                                })
                            }
                        })
                    })
                }
            },

            reminderTimeSelected(dayIndex, timeString) {
                k('reminderTimeSelected: ', dayIndex, timeString, this.userContentSchedule[this.monthDataKey][dayIndex])

                let currentDayData = this.j_.cloneObject(this.userContentSchedule[this.monthDataKey][dayIndex])
                k('currentDayData: ', currentDayData)

                let dateString = this.moment(currentDayData.timestamp).format('YYYY MMMM D')
                    dateString += ` ${timeString}`
                k('dateString: ', dateString)

                let unixDateTime = Number(this.moment(dateString, 'YYYY MMMM D H:mm').valueOf())
                k('unixDateTime: ', unixDateTime)

                k('is timestamp new? ', currentDayData.timestamp, unixDateTime, currentDayData.timestamp !== unixDateTime)
                if (currentDayData.timestamp !== unixDateTime) {
                    this.userContentSchedule[this.monthDataKey][dayIndex].timestamp = unixDateTime
                    this.userContentSchedule[this.monthDataKey][dayIndex].userLocked = true

                    // create api objects for data
                    let reminderActionsToInsert = this.createInsertReminderActions([this.userContentSchedule[this.monthDataKey][dayIndex]])
                    k('reminderActionsToInsert: ', j(reminderActionsToInsert))

                    let reminderActionsToDelete = this.createDeleteReminderActions([currentDayData])
                    k('reminderActionsToDelete: ', j(reminderActionsToDelete))

                    // create final array for sendRemindersToAPI
                    let remindersToSave = reminderActionsToInsert.concat(reminderActionsToDelete)
                    k('remindersToSave: ', remindersToSave)

                    this.sendRemindersToAPI(remindersToSave, () => {
                        this.saveContentSchedulePreferences(() => {
                            this.generateCurrentMonth(() => {})
                        })
                    })
                }
            },

            createRemindersForMonth(cb) {
                k('create reminders for', this.monthDataKey, ': ', this.userContentSchedule[this.monthDataKey])

                // filter data
                let newRemindersArr = this.userContentSchedule[this.monthDataKey].filter((day) => {
                    return day.timestamp
                })
                k('newRemindersArr: ', newRemindersArr)

                // create api objects for data
                let reminderActionsToInsert = this.createInsertReminderActions(newRemindersArr)
                k('reminderActionsToInsert: ', j(reminderActionsToInsert))

                this.sendRemindersToAPI(reminderActionsToInsert, cb)
            },

            createInsertReminderActions(reminders) {
                return reminders.map((reminder) => {
                    return {
                        action: "insert",
                        data: {
                            type: "SMSreminder",
                            userID: this.userInfo.userID,
                            userLoginToken: this.userLoginToken,
                            environment: this.environmentName,
                            timestamp: reminder.timestamp,
                            // linkingDocID: this.savedUserPreferenceItemID,
                            linkingTable: "userInfo",
                            oneTimeReminder: true,
                            templateName: this.smsReminderTemplateName
                        }
                    }
                })
            },

            createDeleteReminderActions(reminders) {
                return reminders.map((reminder) => {
                    return {
                        action: "delete",
                        data: {
                            id: reminder.reminderDocID
                        }
                    }
                })
            },

            addReminderDocIDsToUserContentSchedule(returnData) {
                let insertedDocs = returnData.filter((item) => {
                    return item.action === 'insert' && item.data.timestamp
                })

                insertedDocs.forEach((doc) => {
                    let userContentScheduleIndex = this.j_.indexFromArray(this.userContentSchedule[this.monthDataKey], 'timestamp', doc.data.timestamp)
                    k('userContentScheduleIndex: ', userContentScheduleIndex)

                    this.userContentSchedule[this.monthDataKey][userContentScheduleIndex].reminderDocID = doc.id
                })
            },

            sendRemindersToAPI(reminders, cb) {

                let req = {
                    reminders: reminders
                }
                k('sendRemindersToAPI req: ', req)

                this.api.post(this.api.ioRoute + 'api/reminders/save', req, (res) => {
                    k('sendRemindersToAPI res: ', res)

                    if (res.success) {
                        this.addReminderDocIDsToUserContentSchedule(res.data)
                    } else {
                        ke('Error: Not able to add Doc IDs to reminders for later deletion.')
                    }

                    cb()
                })
            },

            generateContentScheduleForCurrentMonth() {
                this.calendarLoad = true

                this.generateCurrentMonth(() => {
                    k('now generateContentScheduleForCurrentMonth: ', this.userContentSchedule)

                    // new user
                    if (!this.userContentSchedule) this.userContentSchedule = {}

                    // previously had data for month
                    if (this.userContentSchedule[this.monthDataKey]) {
                        k('overwrite month data: ', this.userContentSchedule[this.monthDataKey])
                        this.originalUserContentScheduleMonthData = this.j_.cloneObject(this.userContentSchedule[this.monthDataKey])
                    }

                    // clearing all data gets rid of locked items
                    // this.userContentSchedule[this.monthDataKey] = []

                    let scheduleIndex = 0

                    k('generate content schedule: ', this.userContentSchedule, this.monthDataKey)
                    this.userContentSchedule[this.monthDataKey] = this.displayCalendar.map((day) => {
                        // k('generate day: ', scheduleIndex, day)
                        let returnVal
                        let existingLockedDayData

                        if (this.originalUserContentScheduleMonthData) {
                            let originalDayData = this.originalUserContentScheduleMonthData[scheduleIndex]
                            // k('originalDayData: ', originalDayData)
                            if (originalDayData && originalDayData.userLocked) existingLockedDayData = originalDayData
                        }

                        // k('existingLockedDayData: ', existingLockedDayData)

                        // use existing user locked data
                        if (existingLockedDayData) {
                            returnVal = existingLockedDayData
                        }
                        // DO NOT GENERATE CONTENT IF
                        // if no day number, or there is already peach info, or date is in the past, or daysToViewContent does not include the day of week
                        else if (!day.dayNumber ||
                            day.viewingData ||
                            this.moment(day.theDate).endOf('day').format('X') < this.moment().startOf('day').format('X') ||
                            (this.daysToViewContent.length && !this.daysToViewContent.includes(this.moment(day.theDate).format('dddd')))) {
                            returnVal = {}
                        }
                        // otherwise generate new day data
                        else {
                            returnVal = this.getContentFromPool(day.dayNumber)
                        }

                        k('new this.userContentSchedule[this.monthDataKey] ', this.userContentSchedule[this.monthDataKey])

                        scheduleIndex++
                        // k('userContentSchedule Day: ', day, returnVal)
                        return returnVal
                    })

                    k('userContentSchedule: ', this.userContentSchedule)

                    this.replaceUnlockedContentWithNewItemsFromContentPoolNotInCurrentMonth((addedNewItems) => {})

                    // this.newFilters = false
                    this.showContentFiltering = false
                    this.userWantsToRegenerateCalendarContent = false
                    this.localStorage.set('userWantsToRegenerateCalendarContent', false)

                    this.lastUpdatedCalendarTimestamp = this.moment().valueOf()

                    k('lastUpdatedCalendarTimestamp: ', this.lastUpdatedCalendarTimestamp)

                    if (this.useReminders) {
                        this.createRemindersForMonth(() => {
                            this.saveContentSchedulePreferences(() => {
                                this.calendarLoad = false
                                // this.generateCurrentMonth(() => {})
                            })
                        })
                    } else {
                        this.saveContentSchedulePreferences(() => {
                            this.calendarLoad = false
                            // this.generateCurrentMonth(() => {})
                        })
                    }

                    if (this.originalUserContentScheduleMonthData) {
                        let remindersToDeleteArr = this.originalUserContentScheduleMonthData.filter((day) => {
                            return day.reminderDocID
                        })
                        k('remindersToDeleteArr: ', remindersToDeleteArr)

                        let reminderActionsToDelete = this.createDeleteReminderActions(remindersToDeleteArr)
                        k('reminderActionsToDelete: ', j(reminderActionsToDelete))

                        if (reminderActionsToDelete && reminderActionsToDelete.length) this.sendRemindersToAPI(reminderActionsToDelete, () => {})
                    }

                })
            },

            getNewItemsFromContentPool() {
                let contentPool = this.j_.cloneObject(this.contentPool)
                k('current content pool: ', contentPool)

                let newItemsFromContentPool = contentPool.filter((item) => {
                    return this.productIsNew(item)
                })

                return newItemsFromContentPool
            },

            newItemsFromContentPoolNotInCurrentMonth() {
                k('newItemsFromContentPoolNotInCurrentMonth!')

                let newItemsFromContentPoolNotInCurrentMonthSchedule

                let currentMonthSchedule = this.userContentSchedule[this.monthDataKey]
                k('currentMonthSchedule: ', currentMonthSchedule)

                let newItemsFromContentPool = this.getNewItemsFromContentPool()
                k('newItemsFromContentPool: ', newItemsFromContentPool)

                var currentDayIndex = 0
                for (var i = 0; i < this.displayCalendar.length; i++) {
                    var day = this.displayCalendar[i]
                    // kw('DAY: ', day)
                    if (day.today) currentDayIndex = i
                }
                k('currentDayIndex: ', currentDayIndex)

                var daysLeftInCurrentMonthScheduleEligibleToReplace = currentMonthSchedule.slice(currentDayIndex, currentMonthSchedule.length).filter((dayInSchedule) => {
                    // k('dayInSchedule: ', dayInSchedule)
                    return dayInSchedule.productID && !this.productIsNew(dayInSchedule)
                })
                k('daysLeftInCurrentMonthScheduleEligibleToReplace: ', daysLeftInCurrentMonthScheduleEligibleToReplace)

                newItemsFromContentPoolNotInCurrentMonthSchedule = newItemsFromContentPool.filter((item) => {
                    k('item: ', item.productName, item.productID, currentMonthSchedule)
                    let itemInCurrentMonthSchedule = this.j_.queryArrayFirstMatch(currentMonthSchedule, 'productID', item.productID)
                    k('itemInCurrentMonthSchedule: ', itemInCurrentMonthSchedule)
                    return !itemInCurrentMonthSchedule
                })
                k('newItemsFromContentPoolNotInCurrentMonthSchedule: ', newItemsFromContentPoolNotInCurrentMonthSchedule)

                return newItemsFromContentPoolNotInCurrentMonthSchedule.length > daysLeftInCurrentMonthScheduleEligibleToReplace.length ? newItemsFromContentPoolNotInCurrentMonthSchedule.slice(0, daysLeftInCurrentMonthScheduleEligibleToReplace.length) : newItemsFromContentPoolNotInCurrentMonthSchedule
            },

            replaceUnlockedContentWithNewItemsFromContentPoolNotInCurrentMonth(cb) {

                let newItemsFromContentPoolNotInCurrentMonth = this.newItemsFromContentPoolNotInCurrentMonth()
                // k('newItemsFromContentPoolNotInCurrentMonth: ', newItemsFromContentPoolNotInCurrentMonth)

                k('replaceUnlockedContentWithNewItemsFromContentPoolNotInCurrentMonth: ', newItemsFromContentPoolNotInCurrentMonth)

                if (newItemsFromContentPoolNotInCurrentMonth && newItemsFromContentPoolNotInCurrentMonth.length) {
                    k('replace !userLocked days in schedule with newContentItems')

                    let newItemsFromContentPool = this.getNewItemsFromContentPool()
                    let newItemsFromContentPoolIDs = newItemsFromContentPool.map((newContentItem) => {
                        return newContentItem.productID
                    })
                    k('newItemsFromContentPoolIDs: ', newItemsFromContentPoolIDs)

                    let currentMonthSchedule = this.userContentSchedule[this.monthDataKey]

                    newItemsFromContentPoolNotInCurrentMonth.forEach((newContentItem) => {
                        // k('process newContentItem: ', newContentItem)
                        for (var i = 0; i < currentMonthSchedule.length; i++) {
                            var dayInSchedule = currentMonthSchedule[i]
                            k('dayInSchedule: ', dayInSchedule)

                            if (dayInSchedule.productID && !newItemsFromContentPoolIDs.includes(dayInSchedule.productID) && !dayInSchedule.userLocked) {
                                k('dayInSchedule to replace: ', dayInSchedule)

                                dayInSchedule.productID = newContentItem.productID
                                dayInSchedule.productSKU = newContentItem.productSKU
                                dayInSchedule.tags = newContentItem.tags
                                dayInSchedule.blurb = newContentItem.productBlurb
                                dayInSchedule.displayName = newContentItem.productName
                                dayInSchedule.userLocked = false

                                k('new dayInSchedule: ', dayInSchedule)
                                break;
                            }
                        }
                    })
                    cb(true)
                } else {
                    cb(false)
                }

            },

            getContentFromPool(dayNumber) {
                k('getContentFromPool')

                if (!this.localContentPool.length) this.localContentPool = this.j_.cloneObject(this.contentPool)

                // prioritize new content?
                // let newItemsFromContentPoolNotInCurrentMonth = this.userContentSchedule[this.monthDataKey] ? this.newItemsFromContentPoolNotInCurrentMonth() : []
                // k('newItemsFromContentPoolNotInCurrentMonth: ', newItemsFromContentPoolNotInCurrentMonth)

                let res
                // if (newItemsFromContentPoolNotInCurrentMonth.length) {
                //     let contentItem = newItemsFromContentPoolNotInCurrentMonth[0]

                //     let timestamp = this.generateTimestampForContent(dayNumber)

                //     res = {
                //         productID: contentItem.productID,
                //         productSKU: contentItem.productSKU,
                //         tags: contentItem.tags,
                //         blurb: contentItem.productBlurb,
                //         displayName: contentItem.productName,
                //         timestamp: timestamp
                //     }
                // } else {
                    res = this.randomContentFromPool(dayNumber)
                // }

                k('getContentFromPool res: ', res)
                return res
            },

            randomContentFromPool(dayNumber) {
                // if (!this.localContentPool.length) this.localContentPool = this.j_.cloneObject(this.contentPool)

                let randomInteger = this.j_.randomInteger(0, this.localContentPool.length - 1)
                // let localContentPoolIndex = this.j_.indexFromArray(this.localContentPool, 'productID', this.localContentPool[randomInteger].productID)
                let splicedItemArray = this.localContentPool.splice(randomInteger, 1)
                let contentItem = splicedItemArray[0]
                k('randomContentFromPool: ', contentItem)

                let timestamp = this.generateTimestampForContent(dayNumber)

                let productDataToSave = {
                    productID: contentItem.productID,
                    productSKU: contentItem.productSKU,
                    tags: contentItem.tags,
                    blurb: contentItem.productBlurb,
                    displayName: contentItem.productName,
                    userLocked: false,
                    timestamp: timestamp
                }
                k('productDataToSave: ', productDataToSave)
                return productDataToSave
            },

            generateTimestampForContent(dayNumber) {
                k('useReminders: ', this.useReminders, this.defaultReminderTime)

                let dateString = `${this.selectedYear} ${this.selectedMonthName} ${dayNumber} ${this.useReminders ? this.defaultReminderTime : ''}`
                k('dateString: ', dateString)

                let unixDateTime = Number(this.moment(dateString, this.useReminders ? 'YYYY MMMM D H:mm' : 'YYYY MMMM D').valueOf())
                k('unixDateTime: ', unixDateTime)

                return unixDateTime
            },

            generateCurrentMonth(cb) {
                k('modifyCalendarBasedOnStartDay: ', this.viewingData)

                this.displayCalendar = []

                this.$nextTick(() => {
                    let displayCalendar = []

                    for (var i = 0; i < this.totalCalendarDays; i++) {

                        var theDate = this.moment(this.startDate).add(i, 'days')
                        var viewingDataForDay = this.viewingData.filter((day) => {
                            // kw('day: ', theDate.format('MM-DD-YYYY'), this.moment(day.date).format('MM-DD-YYYY'))
                            var totalSeconds = 0
                            if (day.productsViewed.length) day.productsViewed.forEach((product) => {
                                totalSeconds += product.secondsViewed
                            })

                            var viewLengthIsHigherThanThreshold = totalSeconds > this.viewThresholdInSeconds
                            var currentDay = theDate.format('MM-DD-YYYY') === this.moment(day.date).format('MM-DD-YYYY')

                            return currentDay && viewLengthIsHigherThanThreshold ? day : ''
                        })

                        // k('viewingDataForDay: ', viewingDataForDay)

                        displayCalendar[i] = {
                            theMonth: theDate.format('MMM'),
                            theDate: theDate,
                            dayNumber: i + 1,
                            viewingData: viewingDataForDay.length ? viewingDataForDay[0].productsViewed : ''
                        }

                        if (this.moment(theDate).isSame(Date.now(), 'day')) { // it's today
                            displayCalendar[i].today = true
                        }
                    }

                    // now pad the beginning with an offset
                    this.calendarOffset = this.moment(this.startDate).day()

                    for (i = 0; i < this.calendarOffset; i++) {
                        displayCalendar.unshift({})
                    }

                    this.displayCalendar = displayCalendar

                    cb()
                })

            },

            getUserMediaPlayData(cb) {
                var timezoneOffset = this.moment().format('Z')
                // k('timezoneOffset: ', timezoneOffset)

                // k('getUserMediaPlayData: ', this.environmentName, this.userInfo)

                var req = {
                    filters: {
                        environment: this.environmentName,
                        eventType: 'mediaPlay',
                        userID: this.userInfo.userID
                    },
                    key2agg: 'productID',
                    key2sum: 'elapsed',
                    orderDirection: 'desc',
                    forceProd: false,
                    localTimeZone: this.moment().format('Z')
                    // startMSeconds: 1510531200000,
                    // endMSeconds: 1510617600000
                }
                // k('viewing data req: ', req)

                this.api.post(this.api.ioRoute + 'api/stats/mediaPlay4UserByDate', req, (res) => {
                    // k('viewing data res: ', res)
                    if (res) {
                        this.viewingData = res.filter((day) => {
                            return day.productsViewed.length
                        }).sort((a, b) => {
                            // k('viewing data sort: ', this.moment(a.date).valueOf(), this.moment(b.date).valueOf())
                            return this.moment(b.date).valueOf() - this.moment(a.date).valueOf()
                        })

                        // k('viewingdata after sort: ', this.viewingData)

                        cb()
                    }
                })
            },

            haveUserPreferences() {
                k('haveUserPreferences: ', this.userPreferences)
                this.watchUserPreferenceFlag = true

                this.setContentSchedulePreferences()
                if (
                    this.userContentSchedule && !this.userContentSchedule[this.monthDataKey] ||
                    this.savedUserPreferenceItemID && !this.userContentSchedule
                ) {
                    this.userWantsToRegenerateCalendarContent = true
                }
                this.setupCalendar()
            },

            // animation methods

            beforeEnter(el) {
                el.style.opacity = 0
                el.style.backgroundColor = this.highlightColor
            },

            enter(el, done) {
                var delay = el.dataset.index * 30
                setTimeout(() => {
                    this.Velocity(
                        el, { opacity: 1, backgroundColor: '#fff' }, { easing: 'easeInSine', complete: done }
                    )
                }, delay)
            }
        },

        watch: {
            currentMonthContainsLockedItems() {
                k('currentMonthContainsLockedItems: ', this.currentMonthContainsLockedItems)
            },

            userPreferences() {
                if (this.userPreferences && !this.watchUserPreferenceFlag) {
                    this.haveUserPreferences()
                }
            }
        },

        created() {
            k('aiCalendar created')

            if (this.localStorage.get('userWantsToRegenerateCalendarContent')) {
                this.userWantsToRegenerateCalendarContent = true
            }

            this.startDate = this.moment(this.firstDayOfCurrentMonth).valueOf()

            this.$root.$on('setUserWantsToRegenerateCalendarContent', () => {
                k('setUserWantsToRegenerateCalendarContent fired')
                this.userWantsToRegenerateCalendarContent = true
            })

            if (this.userPreferences) {
                this.haveUserPreferences()
            }
            else {
                this.getUserPreferences(() => {
                    this.haveUserPreferences()
                }, true)
            }

            if (this.userInfo && this.userInfo.phoneNum) {
                this.phoneNumber = this.userInfo.phoneNum
            }
        }
    }
</script>

<style scoped>
    #calendar {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    .card {
        position: relative;
        /*background: #fff;*/
        height: 100%;
        /*min-height: 4.5rem;*/
        border: 1px solid #ddd;
        overflow: hidden;
    }

    .day {
        width: 14.28%;
        min-height: 4rem;
        display: block;
        position: relative;
    }

    .contentDay {
        background-size: cover !important;
        background-position: 50% !important;
        height: 100%;
    }

    .dayDate {
        color: #999;
        background: #fff;
        padding: .3rem;
    }

    .dayHeader {
        background: #999;
        color: #fff;
        padding: .2rem;
    }

    .padded {
        padding: .5rem;
    }

    .pchip {
        /*width: fit-content;*/
        color: #fff;
        padding: .25rem .5rem;
        margin: 0;
        border-bottom-right-radius: .2rem;
    }

    @media screen and (min-width: 768px) {
        .day {
            min-height: 8rem;
        }
    }
</style>
