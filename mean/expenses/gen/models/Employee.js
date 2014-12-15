var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Category = require('./Category.js');
var Expense = require('./Expense.js');

/**
 *  An employee reports expenses. 
 */
// declare schema
var employeeSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    username : {
        type : String,
        "default" : null
    },
    expenses : [{
        type : Schema.Types.ObjectId,
        ref : "Expense",
        "default" : []
    }]
});
//            employeeSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

employeeSchema.methods.declareExpense = function (description, amount, date, category) {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(String, 'findOne', [ ({ _id : description._id }) ]);
        }),
        Q().then(function() {
            return Q.npost(Double, 'findOne', [ ({ _id : amount._id }) ]);
        }),
        Q().then(function() {
            return Q.npost(Date, 'findOne', [ ({ _id : date._id }) ]);
        }),
        Q().then(function() {
            return Q.npost(require('./Category.js'), 'findOne', [ ({ _id : category._id }) ]);
        }),
        Q().then(function() {
            return me;
        })
    ]).spread(function(description, amount, date, category, readSelfAction) {
        return require('./Expense.js').newExpense(description, amount, date, category, readSelfAction);
    }).then(function(newExpense) {
        return newExpense;
    }).then(function(__result__) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            return __result__;    
        });
    }).then(function(__result__) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            return __result__;    
        });
    })
    ;
};
/*************************** DERIVED PROPERTIES ****************/

employeeSchema.methods.getTotalRecorded = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return me.getRecordedExpenses();
        }),
        Q().then(function() {
            return me;
        })
    ]).spread(function(recordedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(recordedExpenses);
    }).then(function(totalExpenses) {
        return totalExpenses;
    });
};

employeeSchema.methods.getTotalSubmitted = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return me.getSubmittedExpenses();
        }),
        Q().then(function() {
            return me;
        })
    ]).spread(function(submittedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(submittedExpenses);
    }).then(function(totalExpenses) {
        return totalExpenses;
    });
};

employeeSchema.methods.getTotalApproved = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return me.getApprovedExpenses();
        }),
        Q().then(function() {
            return me;
        })
    ]).spread(function(approvedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(approvedExpenses);
    }).then(function(totalExpenses) {
        return totalExpenses;
    });
};

employeeSchema.methods.getTotalRejected = function () {
    var me = this;
    return Q.all([
        Q().then(function() {
            return me.getRejectedExpenses();
        }),
        Q().then(function() {
            return me;
        })
    ]).spread(function(rejectedExpenses, readSelfAction) {
        return readSelfAction.totalExpenses(rejectedExpenses);
    }).then(function(totalExpenses) {
        return totalExpenses;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

employeeSchema.methods.getRecordedExpenses = function () {
    var me = this;
    return Q().then(function() {
        return me.expensesByStatus("Draft");
    }).then(function(expensesByStatus) {
        return expensesByStatus;
    });
};

employeeSchema.methods.getSubmittedExpenses = function () {
    var me = this;
    return Q().then(function() {
        return me.expensesByStatus("Submitted");
    }).then(function(expensesByStatus) {
        return expensesByStatus;
    });
};

employeeSchema.methods.getApprovedExpenses = function () {
    var me = this;
    return Q().then(function() {
        return me.expensesByStatus("Approved");
    }).then(function(expensesByStatus) {
        return expensesByStatus;
    });
};

employeeSchema.methods.getRejectedExpenses = function () {
    var me = this;
    return Q().then(function() {
        return me.expensesByStatus("Rejected");
    }).then(function(expensesByStatus) {
        return expensesByStatus;
    });
};
/*************************** PRIVATE OPS ***********************/

employeeSchema.methods.totalExpenses = function (toSum) {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Expense.js'), 'findOne', [ ({ _id : toSum._id }) ]);
    }).then(function(toSum) {
        return Q.npost(/*TBD*/reduce, 'exec', [  ])
        ;
    });
};

employeeSchema.methods.expensesByStatus = function (status) {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Expense.js'), 'find', [ ({ employee : me._id }) ]);
    }).then(function(readLinkAction) {
        return Q.npost(readLinkAction.where({ status : status }), 'exec', [  ])
        ;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Employee', employeeSchema);